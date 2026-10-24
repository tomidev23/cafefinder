export default function ApplicationLogo(props) {
    return (
        <img src="/img/logo/loginlogo.svg" alt="Logo" {...props}  className={`h-10 w-auto rounded-full bg-white object-cover ${props.className || ''}`} />
    );
}