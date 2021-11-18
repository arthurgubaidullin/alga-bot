import { User } from "firebase/auth";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithGithub,
  signOut,
} from "../firebase/client/auth";
import { getSpammers, getUserData } from "../services";
import { Spammer } from "../types/Spammer";
import { UserData } from "../types/UserData";

const useUser = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(setUser), []);
  return user;
};

const useUserData = () => {
  const user = useUser();
  const [userData, setUserData] = useState<UserData | null | undefined>(
    undefined
  );
  useEffect(() => {
    if (user) {
      getUserData(user.uid).then(setUserData);
    } else {
      setUserData(null);
    }
  }, [user]);
  return userData;
};

const useAdminState = () => {
  const userData = useUserData();
  return userData?.isAdmin;
};

const useSpammerDatas = () => {
  const [spammers, setSpammers] = useState<Spammer[] | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const docs = await getSpammers();
      setSpammers(docs);
    })();
  }, []);
  return spammers;
};

const SpammerList = () => {
  const spammers = useSpammerDatas();
  if (spammers === undefined) {
    return <h1>loading…</h1>;
  }
  return (
    <>
      <h1>Spammer list</h1>
      {spammers.length > 0 ? (
        <ol>
          {spammers &&
            spammers.map((spammer) => (
              <li key={spammer.id}>
                {spammer.groupId} {spammer.firstName} {spammer.lastName || null}
              </li>
            ))}
        </ol>
      ) : (
        <p>No spammers in the list.</p>
      )}
    </>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const adminState = useAdminState();

  if (user === null) {
    return (
      <>
        <h1>
          <span>👮</span> 401 Unauthorized
        </h1>
        <button onClick={signInWithGithub}>Sign in with GitHub</button>
      </>
    );
  }
  if (user === undefined || adminState === undefined) {
    return (
      <>
        <h1>loading…</h1>
      </>
    );
  }
  if (!adminState) {
    return (
      <>
        <h1>🐶 403 Forbidden</h1>
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>Alga-bot</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <SpammerList />

        <button onClick={signOut}>Sign out</button>
      </main>
    </div>
  );
};

export default Home;
