import{j as s,A,m as w}from"./vendor-framer-4f4npHb7.js";import{a as p}from"./vendor-react-zSjv4f4x.js";import{experiences as D}from"./ExperienceSection-C_2TIy4A.js";import{skillCategories as h}from"./SkillsSection-DePIWpVj.js";import{projects as j}from"./ProjectsSection-fuWbLngN.js";import{education as T}from"./EducationSection-COkjVcGW.js";import{certs as L}from"./CertificationsSection-Cz6yd4Dj.js";import{links as I}from"./ContactSection-tzOkZCJz.js";import{games as N}from"./GamesSection-RhiZOusv.js";import{T as R,X as z}from"./index-CXp4XPlt.js";const P=["whoami","experience","skills","projects","project","education","certs","contact","games","clear","help"],M=h.map(l=>l.name),W=j.map(l=>l.name);function H(l){const a=l.split(/\s+/);if(a.length===1)return P.filter(c=>c.startsWith(a[0].toLowerCase())&&c!==a[0].toLowerCase());if(a.length===2){const c=a[0].toLowerCase(),i=a[1].toLowerCase();if(c==="skills")return M.filter(e=>e.startsWith(i)&&e!==i);if(c==="project")return W.filter(e=>e.startsWith(i)&&e!==i)}return[]}const K=`
Available commands:
  whoami          — about Ace Perez
  experience      — work history
  skills          — technical skills
  skills <name>   — skills in a category (e.g. skills devops_tooling)
  education       — academic background
  projects        — list projects
  project <name>  — details for a specific project
  certs           — certifications
  contact         — contact links
  games           — 100% completed games
  clear           — clear terminal
  help            — show this help
`.trim();function O(l){const a=l.trim().toLowerCase().split(/\s+/),c=a[0],i=a.slice(1).join(" ");switch(c){case"whoami":return`Ace Perez — DevOps / SRE / Cloud Engineer
Location: County Kildare, Ireland
Bio: Proficient expert in AWS and cloud-based solutions, specialized in
     Software Development and DevOps for scalable, distributed systems.
     Strong in collaborative teamwork and problem-solving within Agile environments.`;case"experience":return D.map((e,n)=>`[${n+1}] ${e.role}
    @ ${e.company} · ${e.period} · ${e.location}`).join(`
`);case"skills":{if(i){const e=h.find(n=>n.name.toLowerCase()===i);return e?`[${e.name}]
  ${e.skills.join(`
  `)}`:`No skill category "${i}". Try: ${h.map(n=>n.name).join(", ")}`}return h.map(e=>`  ${e.name.padEnd(22)} ${e.skills.length} skills`).join(`
`)+`

Tip: run "skills <name>" to see skills in a category.`}case"projects":return j.map(e=>`  ${e.name.padEnd(28)} ★${e.stars}  [${e.tech.join(", ")}]`).join(`
`)+`

Tip: run "project <name>" for details.`;case"project":{const e=j.find(n=>n.name.toLowerCase()===i);return e?`${e.name}  ★${e.stars}

${e.description}

Stack: ${e.tech.join(", ")}`:`Project "${i}" not found. Run "projects" to list all.`}case"education":return T.map(e=>`${e.degree}
  ${e.school} · ${e.period}
  ${e.highlights.join(`
  `)}`).join(`

`);case"certs":return L.map((e,n)=>`  [${n+1}] ${e.name}${e.note?` [${e.note}]`:""}
       Issued by: ${e.issuer}${e.year?` · ${e.year}`:""}`).join(`
`);case"contact":return I.map(e=>`  ${e.label.padEnd(10)} ${e.value}`).join(`
`);case"games":return`100% Completed Games (${N.length} total)

`+N.map((e,n)=>`  [${String(n+1).padStart(2,"0")}] ${e.name.padEnd(40)} 🏆 ${e.achievements} achievements · ${e.completedDate}`).join(`
`);case"help":return K;case"clear":return"__CLEAR__";case"":return"";default:return`command not found: ${l}. Type "help" for available commands.`}}function Z({open:l,onClose:a}){const[c,i]=p.useState([{type:"output",text:`Welcome to ace_perez@ireland — interactive shell
Type "help" to explore.`}]),[e,n]=p.useState(""),[g,C]=p.useState([]),[y,f]=p.useState(-1),[m,d]=p.useState([]),[b,u]=p.useState(-1),x=p.useRef(null),v=p.useRef(null);p.useEffect(()=>{l&&setTimeout(()=>{var t;return(t=x.current)==null?void 0:t.focus()},100)},[l]),p.useEffect(()=>{var t;(t=v.current)==null||t.scrollIntoView({behavior:"smooth"})},[c]);const S=t=>{if(t.preventDefault(),!e.trim())return;const r=O(e);i(r==="__CLEAR__"?[]:o=>[...o,{type:"input",text:e},{type:"output",text:r}]),C(o=>[e,...o]),f(-1),n(""),d([]),u(-1)},E=t=>{const r=t.target.value;if(n(r),r.trim()){const o=H(r);d(o),u(-1)}else d([]),u(-1)},$=t=>{var k;const r=e.split(/\s+/);let o;r.length===1?o=t+" ":(r[r.length-1]=t,o=r.join(" ")+" "),n(o),d([]),u(-1),(k=x.current)==null||k.focus()},_=t=>{if(t.key==="Tab"){if(t.preventDefault(),m.length===1)$(m[0]);else if(m.length>1){const r=(b+1)%m.length;u(r);const o=e.split(/\s+/);o.length===1?n(m[r]):(o[o.length-1]=m[r],n(o.join(" ")))}return}if(t.key==="Escape"){d([]),u(-1);return}if(t.key==="ArrowUp"){t.preventDefault(),d([]);const r=Math.min(y+1,g.length-1);f(r),n(g[r]??"")}else if(t.key==="ArrowDown"){t.preventDefault(),d([]);const r=y-1;r<0?(f(-1),n("")):(f(r),n(g[r]))}};return s.jsx(A,{children:l&&s.jsxs(s.Fragment,{children:[s.jsx(w.div,{className:"fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:a}),s.jsxs(w.div,{className:"fixed z-50 inset-x-4 top-[5%] mx-auto max-w-3xl",initial:{opacity:0,y:-30,scale:.97},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-20,scale:.97},transition:{duration:.2},onClick:t=>t.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-t-lg",children:[s.jsxs("div",{className:"flex gap-1.5",children:[s.jsx("button",{onClick:a,className:"w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"}),s.jsx("div",{className:"w-3 h-3 rounded-full bg-yellow-500/80"}),s.jsx("div",{className:"w-3 h-3 rounded-full bg-green-500/80"})]}),s.jsxs("div",{className:"flex-1 text-center flex items-center justify-center gap-2",children:[s.jsx(R,{className:"w-3.5 h-3.5 text-primary"}),s.jsx("span",{className:"text-xs font-mono text-muted-foreground",children:"ace_perez@ireland:~/portfolio — interactive shell"})]}),s.jsx("button",{onClick:a,className:"text-muted-foreground hover:text-primary transition-colors",children:s.jsx(z,{className:"w-3.5 h-3.5"})})]}),s.jsxs("div",{className:"bg-background border border-t-0 border-border rounded-b-lg p-4 h-[70vh] overflow-y-auto font-mono text-xs",onClick:()=>{var t;return(t=x.current)==null?void 0:t.focus()},children:[c.map((t,r)=>s.jsx("div",{className:"mb-1.5",children:t.type==="input"?s.jsxs("div",{children:[s.jsx("span",{className:"text-primary",children:"ace_perez@ireland"}),s.jsx("span",{className:"text-muted-foreground",children:":~$ "}),s.jsx("span",{className:"text-foreground",children:t.text})]}):s.jsx("pre",{className:"text-card-foreground/85 whitespace-pre-wrap leading-relaxed pl-1",children:t.text})},r)),s.jsxs("form",{onSubmit:S,className:"flex items-center gap-1 mt-1",children:[s.jsx("span",{className:"text-primary",children:"ace_perez@ireland"}),s.jsx("span",{className:"text-muted-foreground",children:":~$ "}),s.jsx("input",{ref:x,type:"text",value:e,onChange:E,onKeyDown:_,className:"flex-1 bg-transparent border-none outline-none text-foreground caret-primary",spellCheck:!1,autoComplete:"off"})]}),m.length>0&&s.jsxs("div",{className:"flex flex-wrap gap-1.5 mt-2 pl-1",children:[m.map((t,r)=>s.jsx("button",{type:"button",onMouseDown:o=>{o.preventDefault(),$(t)},className:`px-2 py-0.5 rounded border text-[10px] font-mono transition-colors ${r===b?"border-primary bg-primary/20 text-primary":"border-border/60 bg-secondary/40 text-muted-foreground hover:border-primary/50 hover:text-primary"}`,children:t},t)),s.jsx("span",{className:"text-[10px] text-muted-foreground/50 self-center",children:"Tab to cycle"})]}),s.jsx("div",{ref:v})]})]})]})})}export{Z as default};
