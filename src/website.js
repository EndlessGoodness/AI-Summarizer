import { makebig } from "./front";
function makeheader(){
    const header=document.createElement("header");
    header.classList.add("header");
    const name=document.createElement("h1");
    name.textContent="InsightDoc";
    header.appendChild(name);
    return header;
}
function createmain(){
    const main=document.createElement("main");
    main.classList.add("main");
    main.setAttribute("id","main");
    return main;
}
function initialize(){
    const cont=document.getElementById("content");
    cont.appendChild(makeheader());
    const main=createmain();
    main.appendChild(makebig());
    cont.appendChild(main);
}
export default initialize;