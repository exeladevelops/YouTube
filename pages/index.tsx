import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Layout, Text, Code } from "@vercel/examples-ui";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface User {
  steamid: string;
  apiKey: string;
}

export default function Home() {
  const { data, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/user/${data?.user?.email?.replace("@steamcommunity.com", "")}`);

          if (!response.ok) {
            const errorMessage = await response.text();
            toast.error(`${response.status} - ${errorMessage}`);
            return;
          }

          const result = await response.json();
          setUser(result);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Error fetching user. Please try again.");
        }
      }
    };

    fetchUser();
  }, [status, data]);

  const handleRegenerateKey = () => setShowConfirm(true);

  const confirmRegenerateKey = async () => {
    try {
      const response = await fetch(`/api/user/${data?.user?.email?.replace("@steamcommunity.com", "")}`, {
        method: "PUT",
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("You may only regenerate a new key once every 3 hours.");
          return;
        }

        const errorMessage = await response.text();
        toast.error(`${response.status} - ${errorMessage}`);
        return;
      }

      const result = await response.json();

      setUser((prevUser) => ({
        ...prevUser!,
        apiKey: result.apiKey,
      }));

      setShowConfirm(false);
      toast.success("Successfully regenerated API key!");
    } catch (error) {
      console.error("Error regenerating key:", error);
      toast.error("Error regenerating key. Please try again.");
    }
  };

  const cancelRegenerateKey = () => setShowConfirm(false);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col justify-center h-screen">
        <section className="flex flex-col gap-6 text-center">
          <Text variant="h1">exeladevelops/youtube 🎧</Text>
        </section>

        <hr className="border-t border-accents-2 my-6" />

        <section className="flex flex-col gap-3">
          {status === "authenticated" ? (
            user ? (
              <section className="flex flex-col gap-3 text-center">
                <section className="flex flex-col gap-3 items-center">
                  <Image
                    className="h-75 w-75 rounded-full"
                    src={data?.user?.image || "https://avatar.vercel.sh/leerob"}
                    height={75}
                    width={75}
                    alt={`${data?.user?.name || "placeholder"} avatar`}
                  />
                </section>
                <Text variant="h2">Hello, {data?.user?.name}! </Text>
                <Text variant="description">{user.steamid}</Text>
                <Code>{user.apiKey}</Code>
                <Text variant="smallText">
                  Your API key is like a password - never share or publish it!
                </Text>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center gap-3">
                    <Button variant="secondary" onClick={handleRegenerateKey} className="w-full">
                      Regenerate Key
                    </Button>
                    <Button className="w-full" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </section>
            ) : (
              <section className="m-auto w-fit">
                <Text>Loading...</Text>
              </section>
            )
          ) : (
            <section className="m-auto w-fit">
              <Button size="lg" onClick={() => signIn()}>
                Authenticate using Steam
              </Button>
            </section>
          )}
        </section>
      </div>

      {showConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Regenerate your API key?
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This will invalidate your current API key and generate a
                        new one.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={confirmRegenerateKey}
                  className="w-full inline-flex justify-center sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Yes, Regenerate
                </Button>
                <Button
                  variant="secondary"
                  onClick={cancelRegenerateKey}
                  className="mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Home.Layout = Layout;
