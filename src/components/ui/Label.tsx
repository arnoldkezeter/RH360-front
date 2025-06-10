

interface Props {
    required?: boolean;
    text: string;
}

const Label = ({ required = false, text }: Props) => {
    return (
        <div className="mt-3">
            <label >{text}</label>
            {required && <label className="text-red-500"> *</label>}
        </div>
    );
};







interface ErrorProps {
    message: string
}

const ErrorMessage = ({ message }: ErrorProps) => {
    return (
        <div>
            {message && <p className="text-red-500 text-[13px] py-0.5">{message}</p>}
        </div>
    );
};






export { Label, ErrorMessage };
