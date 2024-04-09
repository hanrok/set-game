import cn from "clsx";

interface IAlertProps {
  type?: "info" | "success" | "error" | "warning" | string;
  message?: string | React.ReactNode;
}

const Alert = ({ type = "info", message }: IAlertProps) => {
  const className = cn("text-center p-3 rounded mb-6", {
    "bg-gray-600 text-gray-200": type === "info",
    "bg-green-300 text-green-900": type === "success",
    "bg-yellow-200 text-yellow-900": type === "warning",
    "bg-red-300 text-red-800": type === "error",
  });
  return <div className={className}>{message}</div>;
};

export default Alert;
