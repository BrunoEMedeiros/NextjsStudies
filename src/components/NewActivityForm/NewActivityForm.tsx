"use client";
import { RotatingLines } from "react-loader-spinner";
import FormTextField from "../FormTextField/FormTextField";
import { useNewActivityForm } from "./useNewActivityForm";
import FormTextArea from "../FormTextArea/FormTextArea";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import DateTimeActivityCalendar from "../DateTimeActivityCalendar/DateTimeActivityCalendar";
import { FaSave } from "react-icons/fa";

export default function NewActivityForm() {
  const {
    onSubmit,
    handleSubmit,
    isSubmitting,
    register,
    errors,
    paymentRequired,
    setPaymentRequired,
  } = useNewActivityForm();

  return (
    <form
      onSubmit={() => {}}
      className="grid gap-4 grid-cols-[1fr_1fr] w-full mx-auto p-4"
    >
      <div>
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
            className="w-32"
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
          <CustomSwitch
            label="Obrigatória ?"
            setActive={setPaymentRequired}
            active={paymentRequired}
          />
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
      <div className="w-full col-span-2 border rounded border-white p4">
        <p>Agendamentos</p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${
          isSubmitting ? "bg-gray-600" : "bg-blue-500"
        } text-white p-4 w-1/4 rounded-md col-span-2 mt-4 max-h-14 mx-auto flex items-center justify-center`}
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
          <p className="text-lg font-light">{<FaSave />}</p>
        )}
      </button>
    </form>
  );
}
