import { toast } from "@/hooks/use-toast";

interface ToastMessageProps {
	title: string;
	message: string;
	type: "success" | "error" | "default";
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
