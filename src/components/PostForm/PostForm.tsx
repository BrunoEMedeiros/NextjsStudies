"use client";

import { ReactNode, useState } from "react";
import { FieldError } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import FormTextField from "../FormTextField/FormTextField";
import FormTextArea from "../FormTextArea/FormTextArea";
import { usePostForm } from "./usePostForm";
import { PostType } from "@/src/lib/schemas/post.schema";

type PostFormProps = {
  editingPost?: PostType | null;
  trigger: ReactNode;
};

export default function PostForm({ editingPost, trigger }: PostFormProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, errors, isSubmitting, onSubmit, resetForm } =
    usePostForm({
      editingPost,
      onSuccess: () => setOpen(false),
    });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-earth-yellow">
            {editingPost ? "Editar postagem" : "Nova postagem"}
          </DialogTitle>
          <DialogDescription>
            {editingPost
              ? "Altere os dados da postagem selecionada."
              : "Preencha os dados para criar uma nova postagem."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormTextField
            label="Título"
            placeholder="Título da postagem"
            labelClassName="text-base text-earth-yellow font-bold"
            error={errors.title}
            {...register("title")}
          />
          <FormTextArea
            label="Texto"
            placeholder="Conteúdo da postagem"
            labelClassName="text-base text-earth-yellow font-bold"
            error={errors.text}
            {...register("text")}
          />
          <FormTextField
            label="Imagem"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            placeholder=""
            labelClassName="text-base text-earth-yellow font-bold"
            inputClassName="file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-earth-yellow file:text-rich-black hover:file:opacity-90 cursor-pointer"
            error={errors.image as FieldError | undefined}
            helperText={
              editingPost?.image_url
                ? "Deixe em branco para manter a imagem atual"
                : undefined
            }
            {...register("image")}
          />
          <FormTextField
            label="Arquivo"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            placeholder=""
            labelClassName="text-base text-earth-yellow font-bold"
            inputClassName="file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-earth-yellow file:text-rich-black hover:file:opacity-90 cursor-pointer"
            error={errors.file as FieldError | undefined}
            helperText={
              editingPost?.file_url
                ? "Deixe em branco para manter o arquivo atual"
                : undefined
            }
            {...register("file")}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-confirm min-w-[100px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingPost ? (
                "Salvar"
              ) : (
                "Criar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
