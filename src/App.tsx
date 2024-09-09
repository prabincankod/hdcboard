import { useEffect, useState } from "react";
import { supabase } from "./lib/utils";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  BookMarked,
  CircuitBoard,
  Loader2,
  PlusCircle,
  UserCircle,
} from "lucide-react";
import { Database } from "database.types";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

function App() {

const { slug }  = useParams();


  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const navigater = useNavigate();
  const navigation = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigater("/login");
      } else {
        setUser(data.session.user);
      }
    });
  }, []);

  const [classes, setClasses] = useState<
    Database["public"]["Tables"]["category"]["Row"][] | null
  >(null);

  const [loadingClass, setLoadingClass] = useState(true);

  const [parent, enableAnimations] = useAutoAnimate({
    easing: "ease-in",
    duration: 300,
  });

  const storeClass = async () => {
    if (className) {
      setLoading(true);

      const { data, error } = await supabase
        .from("category")
        .insert({
          name: className,
          userId: (await supabase.auth.getSession()).data.session.user.id,
        })
        .select();

      // await supabase.auth.updateUser({
      //   data: {
      //     name: "Prabin Subedi",
      //   },
      // });

      setOpen(false);
      setLoading(false);
      setClassName(null);
    }
  };

  const fetchClasses = async () => {
    return await supabase.from("category").select();
  };

  useEffect(() => {
    fetchClasses().then((data) => {
      setClasses(data.data);
      setLoadingClass(false);
    });
  }, [open]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">



      {user && (
        <div className="flex justify-between items-center mb-6 md:mb-8 ">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="https://miro.medium.com/v2/resize:fit:6528/1*7Ta8ZP2gUZvdXbRgQRY3Tw.jpeg"
                alt="user"
                width={500}
                height={400}
                className="object-cover w-full h-full"
                style={{ aspectRatio: "500/400", objectFit: "cover" }}
              />
            </div>
            <div className="ml-4">
              {/* <div className="text-lg font-bold">{user.user_metadata.name}</div> */}
              <div className="text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="text-gray-500">
                    <div className="text-sm">
                      <div className="font-bold">{user.email}</div>
                      <div className="text-xs">{user.phone}</div>
                      {/* logout */}
                      <div className="text-xs">
                        <button
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                          onClick={async () => {
                            await supabase.auth.signOut();
                            navigater("/login");
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl font-bold md:text-3xl inline-flex items-center">
          My Boards{" "}
          <CircuitBoard className="ml-2 w-5 h-5 animate-pulse text-primary" />
        </h1>
        <Dialog defaultOpen={open} open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              Create Class
              <PlusCircle className=" ml-2 w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Class</DialogTitle>
              <DialogDescription>
                Add a class to your account to store images.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={loading} type="submit" onClick={storeClass}>
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {loadingClass && (
        <div className="flex  flex-col justify-center items-center h-screen">
          <Loader2 className="h-36 w-36 animate-spin" />
        </div>
      )}

      <div
        ref={parent}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {classes?.map((classItem) => (
          <Card
            key={classItem.id}
            className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
          >
            <span className="sr-only">View</span>

            <img
              src="https://miro.medium.com/v2/resize:fit:6528/1*7Ta8ZP2gUZvdXbRgQRY3Tw.jpeg"
              alt="Item 1"
              width={500}
              height={400}
              className="object-cover w-full h-48 md:h-56"
              style={{ aspectRatio: "500/400", objectFit: "cover" }}
            />
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg font-semibold">{classItem.name}</h3>

              <div className="flex items-center justify-between mt-4">
                {/* <div className="text-lg font-bold">$99</div> */}
                <Button
                onClick={() => navigater(`/class/${classItem.id}`)}
                size="sm" variant="outline">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>




      <Outlet />
    </div>

  );
}

export default App;
