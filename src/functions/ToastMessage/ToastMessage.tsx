import { toast } from "@/hooks/use-toast";

interface ToastMessageProps {
	title: string;
	message: string;
	type: "success" | "error" | "default";
}

export function UnexpectedErrorToast() {
	return ToastMessage({
		title: "Noget gik galt",
		message: "Kunne ikke slette reolen - prøv igen.",
		type: "error",
	});
}

export function ToastMessage({ title, message, type }: ToastMessageProps) {
	const toastType =
		type === "success"
			? "success"
			: type === "error"
				? "destructive"
				: "default";
	toast({
		variant: toastType,
		title: title,
		description: message,
	});
}
