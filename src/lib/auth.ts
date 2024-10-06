import { auth } from "../firebase/config";
import { addDocument, getDocument } from "../firebase/services";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const registerNewUser = async (credentials: RegisterCredentialsType) => {
  const { email, password, username } = credentials;

  const data = await getDocument(
    {
      collectionName: "users",
    },
    {
      fieldName: "username",
      operator: "==",
      compareValue: username,
    }
  );

  if ((data as IUser[]).length) throw new Error("Username already existed");

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const newUser = userCredential.user;

  await addDocument({
    collectionName: "users",
    id: newUser.uid,
    data: {
      email: newUser.email,
      username: username,
      photoUrl: "",
      role: "customer",
    },
  });

  return {
    uid: newUser.uid,
    email: newUser.email,
    photoUrl: "",
    username: username,
    role: "customer",
  };
};

export const login = async (credentials: CredentialsType) => {
  const { email, password } = credentials;
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const currentUser = userCredential.user;

  const data = await getDocument({
    collectionName: "users",
    id: currentUser.uid,
  });
  if (!data) throw new Error("User not found");
  const currentUserInfo = data as IUser;

  return {
    uid: currentUser.uid,
    email: currentUserInfo.email,
    photoUrl: currentUserInfo.photoUrl || "",
    username: currentUserInfo.username,
    role: currentUserInfo.role,
  };
};

export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  const data = await getDocument({ collectionName: "user", id: user.uid });
  if (!data) throw new Error("User not found");
  const currentUserInfo = data as IUser;

  return {
    uid: user.uid,
    email: currentUserInfo.email,
    photoUrl: currentUserInfo.photoUrl || "",
    username: currentUserInfo.username,
    role: currentUserInfo.role,
  };
};
