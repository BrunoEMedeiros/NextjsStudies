import PostForm from "@/src/components/PostForm/PostForm";
import PostsTable from "@/src/components/PostsTable/PostsTable";
import { Button } from "@/src/components/ui/button";
import { FaPlus } from "react-icons/fa";

export default function PostsPage() {
  return (
    <div className="flex flex-col justify-center pb-20">
      <div className="flex w-full justify-center items-center text-2xl text-white mb-10">
        Postagens
      </div>
      <div className="flex justify-center w-full mb-4">
        <PostForm
          trigger={
            <Button className="bg-earth-yellow text-night py-5 flex items-center gap-2">
              <FaPlus className="w-3 h-3" />
              Nova postagem
            </Button>
          }
        />
      </div>
      <div className="flex justify-center items-center">
        <PostsTable />
      </div>
    </div>
  );
}
