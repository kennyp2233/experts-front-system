'use client';
import BotonesMenu from "@/app/sistema/components/botonesMenu";
import ReturnButton from "@/app/sistema/components/returnButton";
import { useRouter } from "next/navigation";

export default function MantenimientoInit() {
    const router = useRouter();

    return (
        <>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col justify-start w-full h-full">
                    <div className="text-sm breadcrumbs self-start max-sm:hidden">
                        <ul>
                            <li>
                                <a onClick={() => router.push('/sistema')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                    App
                                </a>
                            </li>
                            <li>
                                <a onClick={() => router.push('/sistema/dashboard')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a onClick={() => router.push('/sistema/dashboard/modulos')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                    Modulos
                                </a>
                            </li>
                            <li>
                                <span className="inline-flex gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 19q.825 0 1.413-.587T20 17t-.587-1.412T18 15t-1.412.588T16 17t.588 1.413T18 19m-.2 3q-.35 0-.612-.225t-.338-.575l-.15-.7q-.3-.125-.562-.262T15.6 19.9l-.725.225q-.325.1-.637-.025t-.488-.4l-.2-.35q-.175-.3-.125-.65t.325-.575l.55-.475q-.05-.3-.05-.65t.05-.65l-.55-.475q-.275-.225-.325-.562t.125-.638l.225-.375q.175-.275.475-.4t.625-.025l.725.225q.275-.2.538-.337t.562-.263l.15-.725q.075-.35.337-.562T17.8 12h.4q.35 0 .613.225t.337.575l.15.7q.3.125.562.262t.538.338l.725-.225q.325-.1.638.025t.487.4l.2.35q.175.3.125.65t-.325.575l-.55.475q.05.3.05.65t-.05.65l.55.475q.275.225.325.563t-.125.637l-.225.375q-.175.275-.475.4t-.625.025L20.4 19.9q-.275.2-.537.337t-.563.263l-.15.725q-.075.35-.337.563T18.2 22zM4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h8q.825 0 1.413.588T22 8v1.9q0 .45-.387.675t-.813.025q-.65-.3-1.375-.45t-1.45-.15q-2.95 0-4.962 2.063T11 16.975q0 .475.063.938t.187.912t-.125.813t-.675.362z" /></svg>
                                    Mantenimiento
                                </span>
                            </li>
                        </ul>
                    </div>

                    <ReturnButton
                        className=""
                        onClick={() => router.back()}
                        text="Regresar"
                    />

                    <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl ">Mantenimiento</h1>
                    <h2 className="text-xl self-start max-sm:text-lg">Datos maestros</h2>
                    <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1 ">



                        <BotonesMenu
                            titulo="Productos"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="currentColor" d="m1344 2l704 352v785l-128-64V497l-512 256v258l-128 64V753L768 497v227l-128-64V354zm0 640l177-89l-463-265l-211 106zm315-157l182-91l-497-249l-149 75zm-507 654l-128 64v-1l-384 192v455l384-193v144l-448 224L0 1735v-676l576-288l576 288zm-640 710v-455l-384-192v454zm64-566l369-184l-369-185l-369 185zm576-1l448-224l448 224v527l-448 224l-448-224zm384 576v-305l-256-128v305zm384-128v-305l-256 128v305zm-320-288l241-121l-241-120l-241 120z" /></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/productos')}

                        />

                        <BotonesMenu
                            titulo="Aerolineas"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M19.71 2.837c.733.147 1.306.72 1.453 1.453a3.557 3.557 0 0 1-.773 2.995l-2.751 3.252l1.944 7.131a1.25 1.25 0 0 1-.322 1.213l-1.302 1.302a1.01 1.01 0 0 1-1.597-.224l-2.993-5.387l-3.258 2.255v.787c0 .331-.132.65-.366.884L8.062 20.18a1.01 1.01 0 0 1-1.673-.395l-.544-1.631l-1.631-.544a1.01 1.01 0 0 1-.395-1.673l1.683-1.683a1.25 1.25 0 0 1 .884-.366h.787l2.255-3.258l-5.387-2.993a1.01 1.01 0 0 1-.224-1.597l1.302-1.302a1.25 1.25 0 0 1 1.213-.322l7.13 1.944l3.253-2.751a3.557 3.557 0 0 1 2.995-.773Z"></path></g></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/aerolineas')}
                        />

                        <BotonesMenu
                            titulo="Origenes"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 11.5A2.5 2.5 0 0 0 16.5 9A2.5 2.5 0 0 0 14 6.5A2.5 2.5 0 0 0 11.5 9a2.5 2.5 0 0 0 2.5 2.5M14 2c3.86 0 7 3.13 7 7c0 5.25-7 13-7 13S7 14.25 7 9a7 7 0 0 1 7-7M5 9c0 4.5 5.08 10.66 6 11.81L10 22S3 14.25 3 9c0-3.17 2.11-5.85 5-6.71C6.16 3.94 5 6.33 5 9" /></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/origenes')}
                        />

                        <BotonesMenu
                            titulo="Destinos"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M8.445 3.168a1 1 0 0 1 1.002-.062L15 5.882l5.553-2.776A1 1 0 0 1 22 4v12a1 1 0 0 1-.445.832l-6 4a1 1 0 0 1-1.002.062L9 18.118l-5.553 2.776A1 1 0 0 1 2 20V8a1 1 0 0 1 .445-.832zM5 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 1a1 1 0 0 1-1-1a1 1 0 1 1 2 0v.001a1 1 0 0 1-1 1zm4.707-3.708a1 1 0 1 0-1.414 1.414L14.586 12l-1.293 1.293a1 1 0 0 0 1.414 1.414L16 13.414l1.293 1.293a1 1 0 0 0 1.414-1.414L17.414 12l1.293-1.293a1 1 0 0 0-1.414-1.414L16 10.586l-1.293-1.293z" clipRule="evenodd" /></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/destinos')}
                        />

                        <BotonesMenu
                            titulo="Paises"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100"><path fill="currentColor" d="M2 12a2.5 2.5 0 0 0-2.5 2.5v71A2.5 2.5 0 0 0 2 88h66.88c-.874-1.15-1.746-2.301-2.624-3.45c-1.092-1.611-2.678-2.99-3.143-4.948c-6.43 2.654-13.818 2.9-20.416.697c-.145-.047-.287-.105-.431-.154c-.757.74-1.573 2.03-1.702 2.855h-9.507c.714-2.419-.802-6.196.632-8.658c.114-.03.252-.223.315-.422c-.162-.152-.326-.3-.484-.455c-1.406.428-1.968 1.487-2.75 2.416c.427 2.024-2.655 1.545-2.344 3.61c2.147 1.665-1.982.396-3.21.529c-1.303.014-5.115-1.35-3.792 1.44c-.207.766-.016 1.236.365 1.54h-.584c-.091-.876-1.741-1.006-2.377-1.436c-1.071-.26-2.35-.39-3.459-.884c-.285.792-2.857 1.698-3.42 2.32H4.5V46.469c.767.514 2.487.31.143-.8H4.5V34.155c.455-.23.78-.303.76.082c1.127-.38 1.618-3.123 3.568-2c1.216.179 3.228 2.064 2.217 2.3c.788 1.924 1.347.685 2.314 2.978c-.662 3.136 1.873 5.46 3.264 7.459c1.666.692 2.325 2.846 5.033 2.93c.368.322.84.614 1.332.894c.135-1.034.326-2.06.567-3.074c-.065-.015-.128-.024-.198-.047c-2.605 2.403-3.139-1.757-.595-1.92c.17-.011.353-.002.55.025c.295-.035.54 0 .747.073a28.893 28.893 0 0 1 3.673-7.713a27.8 27.8 0 0 1 2.883-3.612c-.526-.88-1.064-1.371-1.699-.222c-.048-1.705-4.658-3.492-1.266-1.856c1.779 1.533 2.362-.266 2.643-1.494c1.525-1.59-1.563-2.133-1-3.172c-.936-1.403-2.322-2.84-3.746-3.709c-2.762.32-3.73-.263-.037-.265c.333-1.725.886-2.947 1.267-4.399c-.4-.115-.818-.097-1.23-.098c-1.767-.237-2.816.446-2.78 1.795c-1.327-.106-.135-2.368-2.181-1.677c-3.102-.049.648.999.36 1.15c-.355.796-2.59.3-2.327 1.107c-1.024-1.894-1.49.903-2.287-1.013c-.48-.46 2.01.454 1.443-1.223c-1.254-.48-1.703.36-2.68.703c-2.916 1.614.509 3.132 1.99 3.67c2.232-.595 2.23-1.347 3.782-.52c1.74.965-1.757.287-1.65 1.772c-.2-.923-.45-1.48-1.53-.297c-1.44.26-2.083-1.719-3.158-1.58c-2.45-.333-1.535 5.177.483 3.301c1.221 2.113-1.56.554-2.385.318c-1.863 2.081-3.87-.054-6.094-.14c-.712-.474-1.41-.48-2.033-.239V17h26.223c-1.87.051-3.54.298-2.86 1.643c-.11 2.594 3.246.534 3.729 2.88c1.394 1.639-.829 5.124 1.582 4.512c-.887 1.079-.776 2.798-.084 4.153a29.788 29.788 0 0 1 8.588-5.036c.055-.308.012-.662-.172-1.08c-.313-1.569 1.143-2.07.633-3.81c.686-1.31.154-2.696-1.022-3.262H95.5v7.078a3.817 3.817 0 0 0-.477-.168c-1.409 1.277-.27 1.398.477 1.111v1.116c-1.666-.937-3.496-1.04-5.273-.65c-.807-1.403-3.664-1.37-4.604-2.633c-1.656-1.984.505-1.392 1.95-1.545c-.41-1.24-2.87-1.828-3.909-1.623c-1.877 1.028.986 1.95.697 3.33c0 1.003-1.223 1.01-2.29.955c.431-1.062-2.043-2.368-3.024-1.504c-1.857-.562-2.565-.232-1.34-2.166c-.428-1.487-2.197-1.515-2.99-2.547c-1.013 2.148-2.702 1.497-4.512 2.805c-.725 1.06-2.235 2.012-2.31 2.712c-1.122.527-2.245-2.162-3.032.22c-.714 2.016.04 2.993-2.369 1.343c-2.493-2.657 5.008-4.933 2.22-6.064c-2.314.675-3.705 2.306-4.165 4.623c-.249.527-.136.894.127 1.191c8.784 2.62 16.053 9.684 19.008 18.35c.046-.522.133-1.024.308-1.391c.739-.564.153 2.165 1.68.613c-1.125 2.415 2.828.32 3.363-.677c-.784-1.968 2.82-2.895 2.736-3.266c-1.327-1.392-.573-.007-2.037.312c-.485-.646.93-4.188-.953-3.863c-2.812-.724 2.392-2.795 3.797-2.033c.64-2.368 1.56-.482-.021.607c-.602 2.101-.314 4.967 1.457 2.159c.796-.775.598-2.795 1.634-3.147c1.392-.656 3.876-1.169 3.811-3.197c.014-.004.027-.003.041-.006V83h-3.959c.858-1.188 1.993-3.22.791-3.957c-1.811-.313-3.164-2.497-5.353-2.406c-.988-1.138-3.263-1.714-3.875-1.936c-.612-.222-1.674 1.061-2.762.494a2.782 2.782 0 0 0-.987.018c3.274 4.25 6.517 8.523 9.772 12.787H98a2.5 2.5 0 0 0 2.5-2.5v-71A2.5 2.5 0 0 0 98 12Zm48.69 5.32c-1.61.793 1.245 3.95 1.324.936c.295.44 2.274.884 1.627-.535c-1.438-.847-1.22.127-2.952-.4m23.081.002c-1.737.846 1.52.862 0 0m-55.18.287c-1.3.966 1.908 1.922.17.051zm10.645.573c.325.312-.321.201 0 0M16.68 19.418c.153.177-.08.013 0 0m4.453.412c1.567.272-.12.64 0 0m2.195.18c1.49-.095.547.37 0 0m-4.375.066c.969.1-.124.449 0 0m3.102 1.408c.98.226-.482.305 0 0m.691 1.559c-.59 1.882 2.097 4.43.012 2.285c-.573-.858-.871-1.68-.012-2.285m-3.498.19c.859 1.435 2.167 1.818 1.072 2.312c-.727-.352-.895-1.449-1.072-2.313m13.479 1.447c.121.081-.326.02 0 0m-20.276.453c-.112.454-.155.007 0 0m7.744.734c-.07.946-.457-.017 0 0m5.748.006c-.374 1.85 1.11 1.732 1.01 1.918c-1.226.54-.933 2.764-1.871 1.067c-.592-.276.304-2.718.707-2.932zm-6.027.002c.131.03-.009.433 0 0m72.336.166c.04.068-.174.17 0 0m-72.264.242c.682.714-.914.65 0 0m31.778.983a25.156 25.156 0 0 0-15.082 5.154c-11.09 8.445-13.248 24.365-4.803 35.455c7.905 10.381 22.34 12.885 33.25 6.238l2.084 2.737c-.41.954-.372 1.866.105 2.494l15.12 19.855c.9 1.181 3.073 1.04 4.853-.316c1.78-1.355 2.493-3.412 1.594-4.594l-15.12-19.855c-.478-.628-1.347-.908-2.376-.766l-2.084-2.736c9.309-8.75 10.736-23.33 2.832-33.711c-4.223-5.545-10.315-8.855-16.737-9.725a25.538 25.538 0 0 0-3.636-.23m-28.389 2.508c.625 1.484 3.039.613 2.094 2.636c1.052.99-.167 4.48-.576 1.506c-2.618-.013-3.868-2.625-1.67-3.996zm2.281.246c.8.68-1.26.379 0 0m62.828 1.828c.07-.05.244.309 0 0m-35.713 1.021a19.62 19.62 0 0 1 14.893 7.76a19.635 19.635 0 0 1-3.734 27.576a19.635 19.635 0 0 1-27.577-3.734a19.635 19.635 0 0 1 3.735-27.576a19.613 19.613 0 0 1 12.683-4.026m38.588 1.03c-1.57 1.299 1.885 1.061 0 0m1.87 1.082c-1.738.849 1.519.85 0 0m1.132.396c-1.55 1.29 1.58.612 0 0m-.062.28c.086-.001-.053.091 0 0m.148.161c.047.076-.125.016 0 0M52.11 36.86c-2.186-.039-4.344.45-6.334 1.328c.104.127.253.249.471.359c-2-.65-2.582 1.877-1.74 3.014l1.353.111l1.131-.498c.731-.76.913-.629 1.149-1.78l.441.057l.35-.146l.797.394c.956.374 1.001 1.18.681 1.416c-.453.279.081.32.125.493c.226-.065.358-.26.5-.364l.256-.092c.934-.613.282-.815-.367-1.642l.344.088c.503.57.799 1.215 1.097 1.9c.034.027.065.062.104.074c.226.075.545.05.818-.025c.27-.074.288-.589.242-1.082c.385 1.756 4.161 1.234 1.914 2.305c-1.295.029-3.353-.681-3.732.216c-.838-.38-1.266-.629-1.436-.824c-.516-.194-2.001-.756-2.054-.756c-.063 0-1.953.344-1.953.344l-1.56.592c-.507 1.634-1.307.76-1.579 2.027c-.213.81-2.046 2.56-1.086 3.938c.857 3.986 5.826 1.332 6.984 3.246c-.544 1.179 2.147 3.422.641 5.353c.71 2.805 2.618 7.494 5.688 3.502c.81-2.39 2.554-3.682 2.492-6.053c-.927-2.335 4.53-4.066 2.347-5.957c-.523.062-.583.175-.998.313c-.872-.033-1.097-.736-1.394-1.178a7.397 7.397 0 0 1-.6-1.017c.555.86 1.128 1.59 1.932 2.039c1.391-.312 2.986-1.341 3.635-2.096c-.016-2.943 3.94.11 3.86 2.322c.245.596.556 1.01.868 1.252a15.07 15.07 0 0 0-1.254-4.086c-1.109-2.434-2.885-4.524-5.043-6.088c-.04.062-.14.066-.12-.084a16.46 16.46 0 0 0-.895-.591c.033.139.073.28.119.423c-.131-.195-.269-.393-.383-.584c-2.356-1.388-5.058-2.184-7.81-2.164zm32.537.132c.725 2.066-2.522 6.854-2.994 3.711c.333-1.554 2.998-1.319 2.994-3.71m-60.875.545c.146-.017-.023.075 0 0m1.541.727c.291.242-.352.182 0 0m30.028.066c.807.68 3.283 1.58.662.862c-1.364.623-1.786.224-.662-.862m-6.238 1.21c-.176.054-.027.419-.137.534c.75.367.33-.347.441-.464c-.152-.072-.246-.089-.304-.07m11.433.745c.232.603.386.988-.21.24a.41.41 0 0 0 .21-.24m-11.363.075c-.294-.032-.45.165-.451.44c.775.421.695-.274.79-.327a.982.982 0 0 0-.34-.113m11.974 4.283c.442.018-.423.64-.275.035c.123-.027.212-.038.275-.035m30.461 3.912c-1.44 1.53 1.716 1.799 0 0m-.1.238c.148-.016-.027.102 0 0m.124.219c.014.103-.15-.025 0 0m1.047.2c-1.395 1.214 1.684.772 0 0m.15.345c.106-.018-.02.147 0 0m-.197.053c.092.124-.081.07 0 0m-11.397 1.572c.025.624.03 1.247.016 1.87c1.147.183 2.584.131 2.611 1.4c2.056.089-.212 3.092-.287.312a4.049 4.049 0 0 0-2.443.414a30.065 30.065 0 0 1-1.332 6.42c1.68-.533 3.394-.481 4.406 1.152c2.665-.01.398 1.807 2.287 2.178c.805-1.644-.424-1.437 1.086-2.777c1.465-1.873.506-4.292-.955-5.315c-.304-1.158-1.515-1.784-.945-2.574c1.11 1.505 2.683.378 1.37-.436c.969-.905 4.431 2.332 2.487-.158c-.96-.178-2.279-2.163-2.578-.885c-.086 1.06-2.731-1.609-3.707-.517c-.282-.984-1.662-.39-1.74.049c.424-.66.157-1.001-.276-1.133m5.088.855c-1.433.814 1.294.786 0 0m-37.435.07c.115.26-.033.043 0 0m-12.553.122a15.73 15.73 0 0 0 .459 4.123c1.15-1.742 1.105-3.378-.459-4.123m49.914.048c.086.062-.106.024 0 0m.969.12c.467.33-.468.33 0 0m0 .01c-.426.306.425.306 0 0m-.873.087c.016.101-.148-.018 0 0m-5.102 1.086c-.01.24-.031.48-.047.72c.323-.364.463-.74.047-.72M58.45 54.617c-1.156.635 1.237.925.237.18l-.043-.107zm1.352.178c-1.142.714-2.914 4.118-.457 4.225c.592-.704 2.093-3.843.457-4.225m30.976 2.168c-.915 1.805 2.657 1.083 0 0m-29.146.24c-1.486.997 1.441.871 0 0m31.531 4.116c.846 1.915-1.96 3.062-1.748 4.84c1.44.694 2.183-1.918 3.197-2.717c1.199-1.048-.944-1.358-1.449-2.123m-66.508 5.89c.164 1.054.658 2.074 1.54 2.385a29.368 29.368 0 0 1-1.54-2.385" color="currentColor"></path></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/paises')}
                        />


                        <BotonesMenu
                            titulo="Unidades de medida"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.875 12c.621 0 1.125.512 1.125 1.143v5.714c0 .631-.504 1.143-1.125 1.143H4a1 1 0 0 1-1-1v-5.857C3 12.512 3.504 12 4.125 12zM9 12v2m-3-2v3m6-3v3m6-3v3m-3-3v2M3 3v4m0-2h18m0-2v4" /></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/unidades_medida')}
                        />

                        <BotonesMenu
                            titulo="Tipo de embarque"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSTransport0"><g fill="none" strokeWidth="4"><rect width="28" height="18" x="16" y="12" fill="#fff" stroke="#fff" strokeLinejoin="round" rx="3" /><path stroke="#000" strokeLinecap="round" d="M24 18v6m12-6v6" /><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M36 12V6H24v6m20 24H12a2 2 0 0 1-2-2V11a2 2 0 0 0-2-2H4" /><path fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M19 42a3 3 0 0 1-3-3v-3h6v3a3 3 0 0 1-3 3m18 0a3 3 0 0 1-3-3v-3h6v3a3 3 0 0 1-3 3" /></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSTransport0)" /></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/tipos_embarque')}
                        />

                    </div>

                    <h2 className="text-xl self-start max-sm:text-lg mt-8">Entidades</h2>
                    <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1 ">



                        <BotonesMenu
                            titulo="Embarcadores"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5m13.5-9l1.96 2.5H17V9.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5" /></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/embarcadores')}

                        />

                        <BotonesMenu
                            titulo="Consignatario"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4a2 2 0 0 0-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5l-3-4h-3V4m-7 2l4 4l-4 4v-3H4V9h6m7 .5h2.5l1.97 2.5H17M6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5" /></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/consignatario')}
                        />

                        <BotonesMenu
                            titulo="Fincas"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17 16h-2v6h-3v-5H8v5H5v-6H3l7-6zM6 2l4 4H9v3H7V6H5v3H3V6H2zm12 1l5 5h-1v4h-3V9h-2v3h-1.66L14 10.87V8h-1z" /></svg>
                            }
                        />

                        <BotonesMenu
                            titulo="Clientes"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M21.053 20.8c-1.132-.453-1.584-1.698-1.584-1.698s-.51.282-.51-.51s.51.51 1.02-2.548c0 0 1.413-.397 1.13-3.68h-.34s.85-3.51 0-4.7c-.85-1.188-1.188-1.98-3.057-2.547s-1.188-.454-2.547-.396c-1.36.058-2.492.793-2.492 1.19c0 0-.85.056-1.188.396c-.34.34-.906 1.924-.906 2.32s.283 3.06.566 3.625l-.337.114c-.284 3.283 1.13 3.68 1.13 3.68c.51 3.058 1.02 1.756 1.02 2.548s-.51.51-.51.51s-.452 1.245-1.584 1.698c-1.132.452-7.416 2.886-7.927 3.396c-.512.51-.454 2.888-.454 2.888H29.43s.06-2.377-.452-2.888c-.51-.51-6.795-2.944-7.927-3.396zm-12.47-.172c-.1-.18-.148-.31-.148-.31s-.432.24-.432-.432s.432.432.864-2.16c0 0 1.2-.335.96-3.118h-.29s.144-.59.238-1.334a10.01 10.01 0 0 1 .037-.996l.038-.426c-.02-.492-.107-.94-.312-1.226c-.72-1.007-1.008-1.68-2.59-2.16c-1.584-.48-1.01-.384-2.16-.335c-1.152.05-2.112.672-2.112 1.01c0 0-.72.047-1.008.335c-.27.27-.705 1.462-.757 1.885v.28c.048.654.26 2.45.47 2.873l-.286.096c-.24 2.782.96 3.118.96 3.118c.43 2.59.863 1.488.863 2.16s-.432.43-.432.43s-.383 1.058-1.343 1.44l-.232.092v5.234h.575c-.03-1.278.077-2.927.746-3.594c.357-.355 1.524-.94 6.353-2.862zm22.33-9.056c-.04-.378-.127-.715-.292-.946c-.718-1.008-1.007-1.68-2.59-2.16c-1.583-.48-1.007-.384-2.16-.335c-1.15.05-2.11.672-2.11 1.01c0 0-.72.047-1.008.335c-.27.272-.71 1.472-.758 1.89h.033l.08.914c.02.23.022.435.027.644c.09.666.21 1.35.33 1.59l-.286.095c-.24 2.782.96 3.118.96 3.118c.432 2.59.863 1.488.863 2.16s-.43.43-.43.43s-.054.143-.164.34c4.77 1.9 5.927 2.48 6.28 2.833c.67.668.774 2.316.745 3.595h.48V21.78l-.05-.022c-.96-.383-1.344-1.44-1.344-1.44s-.433.24-.433-.43s.433.43.864-2.16c0 0 .804-.23.963-1.84V14.66c0-.018 0-.033-.003-.05h-.29s.216-.89.293-1.862z" /></svg>
                            }
                            onClick={() => router.push('/sistema/dashboard/modulos/mantenimiento/datos/clientes')}
                        />

                        <BotonesMenu
                            titulo="Agencias IATA"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50"><path fill="currentColor" d="M46 14H34v-3.976C34 7.173 32.159 4 29.311 4h-9.592C16.868 4 15 7.173 15 10.024V14H4c-1.1 0-2 .9-2 2v29c0 1.1.9 2 2 2h42c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2M30 44H19v-1.067c0-.023.613-.053.906-.088s.55-.094.761-.176c.375-.141.795-.343.948-.606S22 41.45 22 41.017v-10.23c0-.41-.248-.771-.436-1.081s-.499-.56-.78-.747c-.211-.141-.359-.275-.787-.404S19 28.343 19 28.308v-1.283l8.175-.457l-.175.263v13.957c0 .41.316.759.492 1.046s.542.501.87.642c.234.105.485.199.767.281s.871.14.871.176zm-9.381-23.761c0-.891.343-1.652 1.028-2.285s1.503-.949 2.452-.949s1.764.316 2.443.949s1.02 1.395 1.02 2.285s-.343 1.649-1.028 2.276s-1.497.94-2.435.94c-.949 0-1.767-.313-2.452-.94s-1.028-1.385-1.028-2.276M31 14H18v-3.976C18 8.957 19.08 7 20.147 7h8.052C29.264 7 31 8.957 31 10.024z" /></svg>
                            }
                        />

                        <BotonesMenu
                            titulo="Sub Agencias"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M12 3a3 3 0 0 0-1 5.83V11H8a3 3 0 0 0-3 3v1.17a3.001 3.001 0 1 0 2 0V14a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1.17a3.001 3.001 0 1 0 2 0V14a3 3 0 0 0-3-3h-3V8.83A3.001 3.001 0 0 0 12 3" /></g></svg>
                            }
                        />

                        <BotonesMenu
                            titulo="Regiones"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M6.5 2.309v8.69a.499.499 0 0 1-.032.176L9.5 12.691V3.809zm-1-.04L2 3.825v8.906l3.527-1.568a.5.5 0 0 1-.027-.164zm.274-1.216a.498.498 0 0 1 .471.01l3.768 1.884l4.284-1.904A.5.5 0 0 1 15 1.5v10a.5.5 0 0 1-.297.457l-4.5 2a.5.5 0 0 1-.427-.01l-3.789-1.894l-4.283 1.904a.5.5 0 0 1-.703-.457v-10a.5.5 0 0 1 .297-.457zM10.5 3.825v8.906l3.5-1.556V2.27z"></path></svg>}
                        />

                    </div>

                    <h2 className="text-xl self-start max-sm:text-lg mt-8">Recursos Humanos</h2>
                    <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1 ">



                        <BotonesMenu
                            titulo="Funcionarios Agrocalidad"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M13.5 10.097C13.5 7.774 24 6 24 6s10.5 1.774 10.5 4.097c0 3.097-1.91 4.403-1.91 4.403H15.41s-1.91-1.306-1.91-4.403m12.5-.53s-1.467-.534-2-1.067c-.533.533-2 1.067-2 1.067s.4 2.933 2 2.933s2-2.933 2-2.933m5.814 8.713c1.39-1.085 1.174-2.28 1.174-2.28H15.012s-.217 1.195 1.174 2.28a8 8 0 1 0 15.629 0M24 20c2.721 0 4.624-.314 5.952-.766a6 6 0 1 1-11.903 0c1.328.452 3.23.766 5.951.766"></path><path d="m16.879 28l6.477 5.457a1 1 0 0 0 1.288 0L31.121 28S42 31.393 42 35.467V42H6v-6.533C6 31.393 16.879 28 16.879 28m-4.154 9.207a1 1 0 0 1-.725-.961V35h7v1.246a1 1 0 0 1-.725.961l-2.5.715a1 1 0 0 1-.55 0zm20.94-4.082a.17.17 0 0 0-.33 0l-.471 1.52a.174.174 0 0 1-.165.126h-1.526c-.167 0-.237.225-.101.328l1.234.94c.06.046.086.128.063.202l-.471 1.52c-.052.168.13.307.266.204l1.234-.94a.166.166 0 0 1 .204 0l1.234.94c.136.103.318-.036.267-.203l-.472-1.52a.186.186 0 0 1 .063-.203l1.234-.94c.136-.103.066-.328-.101-.328H34.3a.174.174 0 0 1-.165-.125z"></path></g></svg>
                            }
                        />

                        <BotonesMenu
                            titulo="Bodegueros"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 19V8.35c0-.82-.5-1.55-1.26-1.86l-8-3.2c-.48-.19-1.01-.19-1.49 0l-8 3.2C2.5 6.8 2 7.54 2 8.35V19c0 1.1.9 2 2 2h3v-9h10v9h3c1.1 0 2-.9 2-2m-11 0H9v2h2zm2-3h-2v2h2zm2 3h-2v2h2z"></path></svg>
                            }
                        />

                        <BotonesMenu
                            titulo="Choferes"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="currentColor" fillRule="evenodd" d="M15 9.5c0-.437 4.516-3.5 9-3.5s9 3.063 9 3.5c0 1.56-.166 2.484-.306 2.987c-.093.33-.402.513-.745.513H16.051c-.343 0-.652-.183-.745-.513C15.166 11.984 15 11.06 15 9.5m7.5-.5a1 1 0 1 0 0 2h3a1 1 0 0 0 0-2zm-6.462 10.218c-3.33-1.03-2.49-2.87-1.22-4.218H33.46c1.016 1.298 1.561 3.049-1.51 4.097a8 8 0 1 1-15.912.12m7.69.782c2.642 0 4.69-.14 6.26-.384a6 6 0 1 1-11.98.069c1.463.202 3.338.315 5.72.315M32.417 34.6A9.992 9.992 0 0 0 24 30a9.992 9.992 0 0 0-8.42 4.602a2.49 2.49 0 0 0-1.447-1.05l-1.932-.517a2.5 2.5 0 0 0-3.062 1.767L8.363 37.7a2.5 2.5 0 0 0 1.768 3.062l1.931.518A2.492 2.492 0 0 0 14 41.006A1 1 0 0 0 16 41v-1c0-.381.027-.756.078-1.123l5.204 1.395a3 3 0 0 0 5.436 0l5.204-1.395c.051.367.078.742.078 1.123v1a1 1 0 0 0 2 .01c.56.336 1.252.453 1.933.27l1.932-.517a2.5 2.5 0 0 0 1.768-3.062l-.777-2.898a2.5 2.5 0 0 0-3.062-1.767l-1.932.517a2.49 2.49 0 0 0-1.445 1.046m-15.814 2.347A8.008 8.008 0 0 1 23 32.062v4.109a3.007 3.007 0 0 0-1.88 1.987zm14.794 0A8.009 8.009 0 0 0 25 32.062v4.109c.904.32 1.61 1.06 1.88 1.987zM24 40a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clipRule="evenodd"></path></svg>
                            }
                        />

                        <BotonesMenu
                            titulo="Web Usuarios (CCOO)"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor"><path fillRule="evenodd" d="M14 7a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm3 2h-2v6h2z" clipRule="evenodd"></path><path d="M6 7a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zm-1 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1"></path><path fillRule="evenodd" d="M4 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm16 2H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1" clipRule="evenodd"></path></g></svg>
                            }
                        />



                    </div>

                </div>
            </div>
        </>
    );
}