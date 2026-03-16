"use client";
import { ApiError } from "@/src/lib/ApiError";
import { logOff, signin } from "@/src/lib/feature/auth/authSlice";
import {
  CreateActivity,
  createActivitySchema,
} from "@/src/lib/schemas/newActivity.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export function useNewActivityForm() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateActivity>({
    resolver: zodResolver(
      createActivitySchema
    ) as unknown as Resolver<CreateActivity>,
  });

  const onSubmit = async (data: CreateActivity) => {
    try {
      //   await handleCreateUser(data);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          //   if (error.message === "E-mail em uso") {
          //     setError("email", {
          //       type: "manual",
          //       message: "Este e-mail ja esta sendo usado",
          //     });
          //     return;
          //   }
          //   if (error.message === "Telefone em uso") {
          //     setError("phone", {
          //       type: "manual",
          //       message: "Telefone em uso",
          //     });
          //     return;
          //   }
          // }
          // setError("root", {
          //   type: "server",
          //   message: error.message || "Erro no servidor.",
          // });
        }
      } else {
        console.error(error);
        alert("Erro inesperado. Verifique sua conexão.");
      }
    }
  };

  return {
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    register,
  };
}
