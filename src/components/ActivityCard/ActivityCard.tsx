import Image from "next/image";
import DateLabel, { ActivityAvaliableDates } from "../DateLabel/DateLabel";
import { ActivityCardProps } from "../ActivitiesList/ActivitiesList";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import ActivityTypeBadge from "../ActivityTypeBadge/ActivityTypeBadge";
import { FaEdit, FaTrash } from "react-icons/fa";

const ActivityCard = ({
  title,
  type,
  status,
  card_image_url,
  Dates,
}: ActivityCardProps) => {
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
          label="Ativo"
          active={status == 1 ? true : false}
        />
      </div>
      <DateLabel avaliable_activities={Dates} />
      <div className="flex gap-4">
        <button
          type="button"
          className="flex justify-center items-center rounded-md px-2 py-4 w-16 h-4 bg-earth-yellow cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
        >
          <FaEdit size={16} color="#f2f3f4" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center rounded-md px-3 py-4 w-16 h-4 bg-danger cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
        >
          <FaTrash size={16} color="#f2f3f4" />
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
