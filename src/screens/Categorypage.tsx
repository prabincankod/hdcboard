import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/utils";
import { Camera, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

const groupImagesByDate = (images) => {
  const grouped = {};
  images.forEach((image) => {
    if (!grouped[image.created_at]) {
      grouped[image.created_at] = [];
    }
    grouped[image.created_at].push(image);
  });
  // @ts-ignore
  return Object.entries(grouped).sort(
    // @ts-ignore
    (a, b) => new Date(b[0]) - new Date(a[0])
  );
};
const Categorypage = () => {
  const { slug } = useParams();
  const [imageforUpload, setImageforUpload] = useState<FileList | null>(null);
  const [images, setImages] = useState<any[]>([]);

  const [classLoading, setClassLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);

  const onUpload = async () => {
    setUploadLoading(true);

    const { data, error } = await supabase.storage
      .from("boards")
      .upload(
        `${(await supabase.auth.getSession()).data.session.user.id}/${slug}/${v4()}.png`,
        imageforUpload[0]
      );

    const storedImage = await supabase.from("image").insert({
      url: data.fullPath,
      categoryId: +slug,
      userId: (await supabase.auth.getSession()).data.session.user.id,
    });

    setImageforUpload(null);
    setUploadLoading(false);
  };

  const fetchImages = async () => {
    // filter images by date`
    return await supabase.from("image").select().eq("categoryId", +slug);
  };

  useEffect(() => {
    fetchImages().then((data) => {
      setImages(groupImagesByDate(data.data));
      console.log(images);
      setImagesLoading(false);
    });
  }, []);

  return (
    <>
      <div className="max-w-md mx-auto p-4 bg-background text-foreground">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setImageforUpload(e.target.files)}
          hidden={true}
          capture="environment"
        />

        {imageforUpload?.length > 0 && (
          <img
            src={URL.createObjectURL(imageforUpload[0])}
            alt="profile-picture"
            className="w-full h-auto rounded-lg"
          />
        )}

        {!imageforUpload ? (
          <div className="sticky mt-2 top-0 z-10 bg-background pb-4">
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="w-full"
              size="lg"
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
        ) : (
          <div className="sticky mt-2 top-0 z-10 bg-background pb-4">
            <Button
              onClick={async () => {
                await onUpload();
              }}
              className="w-full"
              size="lg"
              disabled={uploadLoading}
            >
              {uploadLoading ? (
                <Loader className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {imagesLoading ? (
            // loader
            <Loader className="animate-spin m-auto " />
          ) : (
            <>
              {images.map(([created_at, ima]) => (
                <div key={created_at}>
                  <h2 className="text-lg font-semibold mb-2">
                    {new Date(created_at).toLocaleDateString()}
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {ima.map((image) => (
                      <img
                        key={image.id}
                        src={`https://blazfyyaavaztayriekn.supabase.co/storage/v1/object/public/${image.url}`}
                        alt={`Image from ${image.created_at}`}
                        className="w-full h-auto rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Categorypage;
