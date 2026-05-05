"use client";
import { RotatingLines } from "react-loader-spinner";
import FormTextField from "../FormTextField/FormTextField";
import { useNewActivityForm } from "./useNewActivityForm";
import FormTextArea from "../FormTextArea/FormTextArea";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import DateTimeActivityCalendar from "../DateTimeActivityCalendar/DateTimeActivityCalendar";
import { FaSave } from "react-icons/fa";
import DateTimeSchedule from "../DateTimeScheduleContainer/DateTimeScheduleContainer";
import ActivityTypeSelectOption from "../ActivityTypeSelectOption/ActivityTypeSelectOption";
import FilterContainer from "../FIlterContainer/FilterContainer";
import FormInputPhoto from "../FormInputPhoto/FormInputPhoto";

const ActivityTypeOptions = [
  { label: "Evento", value: "event", key: "evento" },
  { label: "Cerimônia", value: "ceremony", key: "cerimonia" },
  { label: "Curso", value: "course", key: "curso" },
];

export default function NewActivityForm() {
  const {
    onSubmit,
    handleSubmit,
    isSubmitting,
    register,
    errors,
    paymentRequired,
    setPaymentRequired,
    setValue,
  } = useNewActivityForm();

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit, (validationErrors) =>
          console.log("Zod Blocked Submit. Errors:", validationErrors)
        )}
        className="grid gap-5 grid-cols-[400px_400px] w-full max-w-5xl mx-auto p-4"
      >
        <div className="flex flex-col gap-3">
          <FormTextField
            label="Titulo"
            placeholder="Titulo da atividade"
            labelClassName="text-base text-earth-yellow font-bold"
            type="text"
            error={errors.title}
            className="w-full"
            {...register("title")}
          />

          <FormTextField
            label="Link para rede social"
            placeholder="https://..."
            labelClassName="text-base text-earth-yellow font-bold"
            type="text"
            className="w-full"
            error={errors.social_media_url}
            {...register("social_media_url")}
          />

          <div className="flex w-full gap-4 items-end">
            <div className="flex-1 flex flex-col gap-2">
              <FormTextField
                label="Contribuição"
                labelClassName="text-base text-earth-yellow font-bold"
                type="text"
                className="w-36"
                placeholder="R$ 0.00"
                mask="currency"
                maskOptions={{
                  prefix: "R$ ",
                  groupSeparator: ".",
                  radixPoint: ",",
                  digits: 2,
                  digitsOptional: true,
                  rightAlign: false,
                  autoGroup: true,
                  showMaskOnHover: false,
                  allowMinus: false,
                  autoUnmask: true,
                }}
                {...register("payment_sugestion", {
                  setValueAs: (value) =>
                    value ? parseFloat(value) : undefined,
                })}
                error={errors.payment_sugestion}
              />
              <CustomSwitch
                label="Obrigatória ?"
                setActive={setPaymentRequired}
                active={paymentRequired}
              />
            </div>
            {/*
            ✅ ActivityTypeSelectOption — if you add `activity_type` to the
            schema, replace with {...register("activity_type")}. For now it's
            uncontrolled (cosmetic only).
          */}
            <div className="flex-1 self-start">
              <ActivityTypeSelectOption
                options={ActivityTypeOptions}
                label="Tipo de atividade"
                {...register("type")}
              />
            </div>
          </div>

          <FormTextArea
            label="Descrição"
            placeholder="Descrição da atividade"
            labelClassName="text-base text-earth-yellow font-bold"
            type="text"
            minLength={6}
            className="w-full col-span-2"
            error={errors.description}
            {...register("description")}
          />
        </div>

        <DateTimeActivityCalendar />
        <DateTimeSchedule />
        <FilterContainer />

        {/*
        ✅ Two photo inputs — card image and publicity image.
        Each calls setValue so react-hook-form owns the URL.
      */}
        <div className="col-span-1">
          <FormInputPhoto
            label="Imagem da atividade"
            onFileSelect={(file) => {
              setValue("card_image_url", file, {
                shouldValidate: true, // Triggers Zod to clear the error instantly
              });
            }}
            error={errors.card_image_url?.message as string}
          />
        </div>

        {errors.root && (
          <p className="col-span-2 text-red-500 text-sm text-center">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${
            isSubmitting ? "bg-gray-600" : "bg-blue-500"
          } text-white p-4 w-1/4 rounded-md col-span-2 mt-4 max-h-14 mx-auto flex items-center justify-center`}
        >
          {isSubmitting ? (
            <RotatingLines
              visible
              height="30"
              width="30"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          ) : (
            <FaSave className="text-lg" />
          )}
        </button>
      </form>
    </div>
  );
}
