import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ClientDetail from "@/components/client-information/ClientDetail";

export const metadata: Metadata = {
    title: "Astound AI | Client Detail",
};

export default async function ClientDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Client Detail" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="space-y-6">
                        <ClientDetail clientId={params.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
