import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import BasicTableOne from "@/components/tables/BasicTableOne";

export const metadata: Metadata = {
    title: "Astound ai | Contacts",
};

export default function TablesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Contacts" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="space-y-6">
                        <BasicTableOne />
                    </div>
                </div>
            </div>
        </div>
    );
}
