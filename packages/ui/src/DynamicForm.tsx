// src/components/DynamicForm.tsx
import { Modal, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
// import type { DynamicFormProps } from "../types/book";
import { useEffect } from "react";

export default function DynamicForm({
  visible,
  onClose,
  onSubmit,
  config,
  initialData,
  title = "Form",
}: any) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
  });

  console.log("editBook11", initialData);

  useEffect(() => {
    if (visible) {
      reset(initialData || {});
    }
  }, [initialData, visible, reset]);

  const submitHandler = (data: any) => {
    onSubmit(data);
    reset(); // clear after submit
    onClose();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit(submitHandler)}
      okText="Save"
    >
      <form className="flex flex-col gap-4">
        {config.map((field: any) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.label}</label>
            <Controller
              name={field.name}
              control={control}
              rules={field.rules}
              render={({ field: controllerField }) => {
                switch (field.type) {
                  case "input":
                    return (
                      <Input
                        {...controllerField}
                        placeholder={field.placeholder}
                      />
                    );
                  case "number":
                    return (
                      <Input
                        type="number"
                        {...controllerField}
                        placeholder={field.placeholder}
                      />
                    );
                  case "select":
                    return (
                      <Select
                        {...controllerField}
                        placeholder={field.placeholder}
                        style={{ width: "100%" }}
                        onChange={(val) => controllerField.onChange(val)}
                        value={controllerField.value}
                      >
                        {field.options?.map((opt: any) => (
                          <Select.Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Select.Option>
                        ))}
                      </Select>
                    );
                  default:
                    return <></>;
                }
              }}
            />
            {errors[field.name]?.message && (
              <p className="text-red-500 text-xs mt-1">
                {String(errors[field.name]?.message)}
              </p>
            )}
          </div>
        ))}
      </form>
    </Modal>
  );
}
