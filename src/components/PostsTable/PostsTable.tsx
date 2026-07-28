"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import usePostsTable from "./usePostsTable";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import PostForm from "../PostForm/PostForm";

export default function PostsTable() {
  const {
    posts,
    postsCount,
    isPostsLoading,
    isPostsError,
    currentPage,
    setCurrentPage,
    totalPages,
    onDelete,
  } = usePostsTable();

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-gray-500">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
              <TableHead className="text-base text-earth-yellow p-6">
                Título
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Texto
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Imagem
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Arquivo
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Criado em
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Editar
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Excluir
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPostsLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {isPostsError && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-destructive"
                >
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Erro ao carregar postagens.
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isPostsLoading && !isPostsError && posts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nenhuma postagem encontrada.
                </TableCell>
              </TableRow>
            )}
            {!isPostsLoading &&
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium p-6">
                    {post.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {post.text}
                  </TableCell>
                  <TableCell>
                    {post.image_url ? (
                      <a
                        href={post.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-4"
                      >
                        Ver imagem
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {post.file_url ? (
                      <a
                        href={post.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-4"
                      >
                        Ver arquivo
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <PostForm
                      editingPost={post}
                      trigger={
                        <Button
                          className="bg-earth-yellow text-night py-4 px-6 flex justify-center items-center"
                          variant="outline"
                        >
                          <FaEdit size={20} color="#f2f3f4" />
                        </Button>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteDialog
                      style="flex justify-center items-center rounded-md px-2 py-4 w-16 h-4 bg-danger cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
                      buttonStyle="bg-danger hover:bg-danger"
                      iconColor="#f2f3f4"
                      id={post.id}
                      label="Excluir a postagem: "
                      itemName={post.title}
                      text="Essa postagem será excluída permanentemente do sistema."
                      deleteFunction={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {postsCount > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {postsCount} postage{postsCount !== 1 ? "ns" : "m"} • página{" "}
            {currentPage} de {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
