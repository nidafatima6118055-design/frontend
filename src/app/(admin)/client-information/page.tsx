import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import ClientsTable from "@/components/tables/ClientsTable";

export const metadata: Metadata = {
    title: "Astound AI | Clients",
};

export default function ClientsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Clients" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="space-y-6">
                        <ClientsTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
