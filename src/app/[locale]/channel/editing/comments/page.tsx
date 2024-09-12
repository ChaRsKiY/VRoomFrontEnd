import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";

const channelPage = async ({params: {locale}}) => {
    const {t} = await initTranslations(locale, ['common', 'categories'])
    return (
        <>
            <div className="w-60 bg-white border-r border-gray-200 h-screen">
                <AsideHome t={t}/>
            </div>
            <div className="flex-auto overflow-hidden">

                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-6">Комментарии и упоминания</h1>

                    <div className="flex items-center space-x-4 text-sm">
                        <button className="text-gray-700 border-b-2 border-gray-900">Комментарии</button>
                        <button className="text-gray-700">Упоминания</button>
                    </div>

                    <hr className="my-4 border-gray-300"/>

                    <div className="flex items-center space-x-4 mb-6">

                        <button className="flex items-center text-gray-700 px-3 py-1">
                            Опубликованные
                        </button>
                        <button className="flex items-center bg-black text-white rounded-md border-b-2 px-3 py-1">
                            На проверке
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                        <button className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md">
                            <i className="fas fa-filter mr-2"></i> Фильтр
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center h-96">
                        <img src="https://placehold.co/120x120" alt="No comments illustration" className="mb-4"/>
                        <p className="text-gray-500">Проверять нечего, можно и отдохнуть.</p>
                    </div>
                </div>

            </div>
        </>
    );
}
export default channelPage;