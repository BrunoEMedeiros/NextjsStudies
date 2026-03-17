"use client";
import { RotatingLines } from "react-loader-spinner";
import FormTextField from "../FormTextField/FormTextField";
import { useNewActivityForm } from "./useNewActivityForm";
import FormTextArea from "../FormTextArea/FormTextArea";
import PaymentRequireSwitch from "../PaymentRequireSwitch/PaymentRequireSwitch";
import { Switch } from "../ui/switch";
import CalendarRange from "../DateTimeActivityCalendar/DateTimeActivityCalendar";

export default function NewActivityForm() {
  const { onSubmit, handleSubmit, isSubmitting, register, errors } =
    useNewActivityForm();

  return (
    <form
      onSubmit={() => {}}
      className="grid gap-2 grid-cols-[200px_200px] w-full mx-auto"
    >
      <FormTextField
        label="Titulo"
        placeholder="Titulo da atividade"
        labelClassName="text-base text-earth-yellow font-bold"
        // inputClassName="text-base py-4"
        helperText=""
        type="text"
        error={errors.title}
        className="w-full"
        {...register("title")}
      />

      <FormTextField
        label="Link para rede social"
        placeholder="Link para rede social"
        labelClassName="text-base text-earth-yellow font-bold"
        type="text"
        minLength={6}
        className="w-full"
        error={errors.social_media_url}
        {...register("social_media_url")}
      />
      <div className="flex flex-col gap-4">
        <FormTextField
          label="Contribuição"
          labelClassName="text-base text-earth-yellow font-bold"
          type="text"
          className="w-full"
          placeholder="R$ 0.00"
          mask="currency" // Use the built-in currency alias
          maskOptions={{
            prefix: "R$ ",
            groupSeparator: ".",
            radixPoint: ",",
            digits: 2,
            digitsOptional: true, // 2. This is the magic bullet! It stops pre-filling ".00" so you don't have to backspace
            rightAlign: false, // 3. Keeps your cursor firmly on the left
            autoGroup: true, // 4. Automatically adds the thousands commas as you type
            showMaskOnHover: false, // 5. Fixes the symbol disappearing when your mouse moves over it
            allowMinus: false, // (Optional) Prevents users from typing negative prices
            autoUnmask: true, //
          }}
          {...register("payment_sugestion", {
            // Pro-tip: Convert the unmasked string back to a float for your database
            setValueAs: (value) => (value ? parseFloat(value) : 0),
          })}
          error={errors.payment_sugestion}
        />
        <PaymentRequireSwitch />
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
      <CalendarRange />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${
          isSubmitting ? "bg-gray-600" : "bg-blue-500"
        } text-white p-4 w-full rounded col-span-2 mt-4 max-h-14`}
      >
        {isSubmitting ? (
          <div className="flex justify-center items-center">
            <RotatingLines
              visible={true}
              height="30"
              width="30"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          "Salvar"
        )}
      </button>
    </form>
  );
}
