"use client";
import { memo } from "react";
import Image from "next/image";
import DateLabel, { ActivityAvaliableDates } from "../DateLabel/DateLabel";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import ActivityTypeBadge from "../ActivityTypeBadge/ActivityTypeBadge";
import { FaEdit } from "react-icons/fa";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import { ActivityCardProps } from "../ActivitiesContainer/ActivitiesContainer";
import {
  ActivityDetails,
  fetchActivityById,
} from "@/src/lib/service/activity.service";
import { toast } from "sonner";

const ActivityCard = ({
  id,
  title,
  type,
  status,
  card_image_url,
  Dates,
  onDelete,
  onEdit,
  onActivate,
  onPermanentDelete,
}: ActivityCardProps & { onEdit: (activity: ActivityDetails) => void }) => {
  const handleEditClick = async () => {
    try {
      const activity = await fetchActivityById(id);
      onEdit(activity);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Erro ao carregar atividade.");
    }
  };

  const handleToggleActive = async (nextValue: boolean) => {
    try {
      if (nextValue) {
        await onActivate(id);
      } else {
        await onDelete(id);
      }
    } catch {
      // Erro já tratado via toast na mutation.
    }
  };

  return (
    <div className="bg-rich-black w-60 border rounded-md border-gray-700 flex flex-col items-center justify-between p-4 gap-3">
      <Image
        src={card_image_url}
        alt="Imagem da atividade"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-40 rounded-sm object-center"
      />
      <p className="w-full text-center font-light text-base text-white whitespace-pre-line break-all">
        {title}
      </p>
      <div className="w-full flex justify-center gap-3">
        <ActivityTypeBadge label={type} />
        <CustomSwitch
          lableClassName="text-base"
          label={status == 1 ? "Ativo" : "Inativo"}
          active={status == 1 ? true : false}
          setActive={handleToggleActive}
          confirmOnDeactivate={{
            label: "Excluir a atividade: ",
            itemName: title,
            text: "Esta atividade será inativada dentro do sistemas, serão desfeitos os agendamentos dos usuários ja feitos e novos agendamentos não poderão ser feitos",
          }}
        />
      </div>
      <DateLabel avaliable_activities={Dates} />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleEditClick}
          className="flex justify-center items-center rounded-md px-2 py-4 w-16 h-4 bg-earth-yellow cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
        >
          <FaEdit size={16} color="#f2f3f4" />
        </button>
        <DeleteDialog
          style="flex justify-center items-center rounded-md px-2 py-4 w-16 h-4 bg-danger cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
          buttonStyle="bg-danger hover:bg-danger"
          iconColor="#f2f3f4"
          id={id}
          label="Excluir a atividade: "
          itemName={title}
          text="Se a atividade não possuir agendamentos, ela será excluída permanentemente do sistema. Caso já possua agendamentos, ela será inativada: os agendamentos dos usuários já feitos serão desfeitos e novos agendamentos não poderão ser feitos"
          deleteFunction={onPermanentDelete}
        />
      </div>
    </div>
  );
};

export default memo(ActivityCard);
