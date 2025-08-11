

export default function NavLink(props){

    return(
        <>
            <li>
                <a href={props.path}> {props.text} </a>
            </li>
        </>
    )
}