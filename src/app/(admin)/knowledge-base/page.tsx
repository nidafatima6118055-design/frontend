import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CheckboxComponents from "@/components/form/form-elements/CheckboxComponents";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import InputGroup from "@/components/form/form-elements/InputGroup";
import InputStates from "@/components/form/form-elements/InputStates";
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Astound ai | Intelligent Business Assistant",
  };

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Knowledge Base" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="space-y-6">
            <DefaultInputs />
            {/* <SelectInputs /> */}
            <TextAreaInput />
            <DropzoneComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
