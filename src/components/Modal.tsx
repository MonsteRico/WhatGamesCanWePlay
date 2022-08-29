import React from "react";

interface ModalProps {
	setOpenFunction: React.Dispatch<React.SetStateAction<boolean>>;
	title: string;
	closeButton?: boolean;
	children?: React.ReactNode;
}

export default function Modal({ setOpenFunction, title, closeButton, children }: ModalProps) {
	return (
		<>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="relative w-1/4 my-6 mx-auto max-w-5xl">
					{/*content*/}
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-600 outline-none focus:outline-none">
						{/*header*/}
						<div className="flex items-start justify-between p-5 border-b-4 border-violet-500 rounded-t">
							<h3 className="text-3xl font-semibold">{title}</h3>
							<button
								className="p-1 ml-auto bg-transparent border-0 text-red-400 opacity-70 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setOpenFunction(false)}
							>
								X
							</button>
						</div>
						{/*body*/}
						<div className="relative p-6 flex-auto">{children}</div>
						{/*footer*/}
						{closeButton && (
							<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
								<button
									className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
									type="button"
									onClick={() => setOpenFunction(false)}
								>
									Close
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>{" "}
		</>
	);
}
