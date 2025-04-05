"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { DecodedIdToken } from "firebase-admin/auth";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors (assuming Firebase errors have a 'code' property)
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    // Check if email is verified
    if (!userRecord.emailVerified) {
      return {
        success: false,
        message: "Please verify your email address before signing in.",
      };
    }

    await setSessionCookie(idToken);
    return { success: true }; // Added success return
  } catch (error: unknown) {
    console.error("Sign in error:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Sign in with provider (e.g., Google)
export async function signInWithProvider(params: {
  idToken: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}) {
  const { idToken, name, email, photoURL } = params;

  try {
    // Verify the ID token
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user exists in Firestore
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create new user document if it doesn't exist
      await userRef.set({
        name: name ?? "User", // Use "User" if name is null
        email: email,
        photoURL: photoURL,
        createdAt: new Date(), // Add a creation timestamp
      });
    } else {
      // Optionally update existing user data (e.g., photoURL if changed)
      const updates: { [key: string]: string } = {}; // Use string type for values
      if (photoURL && userSnap.data()?.photoURL !== photoURL) {
        updates.photoURL = photoURL;
      }
      if (name && userSnap.data()?.name !== name) {
        updates.name = name;
      }
      if (Object.keys(updates).length > 0) {
        await userRef.update(updates);
      }
    }

    // Create session cookie
    await setSessionCookie(idToken);

    return { success: true };
  } catch (error: unknown) {
    console.error("Provider sign-in error:", error);
    return {
      success: false,
      message: "Failed to sign in with provider. Please try again.",
    };
  }
}
