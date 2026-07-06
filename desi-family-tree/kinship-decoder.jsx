import React, { useState, useEffect, useMemo } from "react";

/* South Asian Kinship Decoder
 * Trace a relationship from "you" and see its name across South Asian
 * languages, grouped by language family (Indo-Aryan vs Dravidian).
 * Roman transliteration is authoritative; native script shown where available.
 * Spellings and usage vary by region, religion and family. */

const CSS = `
.kx *{box-sizing:border-box;margin:0;padding:0}
.kx{
  --paper:#F4EEE2; --paper2:#ECE4D3; --card:#FBF7EE;
  --ink:#2A241E; --soft:#6E6456; --faint:#938876; --line:#DBD1BC;
  --indo:#B0621F; --indoFill:#F6E7D2; --indoLine:#E4B988;
  --drav:#11706C; --dravFill:#DCEBE7; --dravLine:#8FC4BD;
  --iran:#A23B2E; --iranFill:#F4E0DB; --iranLine:#D9A99F;
  --dard:#3E6088; --dardFill:#DDE6EF; --dardLine:#A8BFD6;
  --serif:"Fraunces","Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
  --sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  font-family:var(--sans); color:var(--ink); background:var(--paper);
  min-height:100%; line-height:1.45; -webkit-font-smoothing:antialiased;
}
.kx-wrap{max-width:760px;margin:0 auto;padding:22px 16px 64px}
.kx-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--faint)}
.kx-h1{font-family:var(--serif);font-weight:600;font-size:clamp(30px,7vw,46px);line-height:1.02;letter-spacing:-.01em;margin:6px 0 8px}
.kx-h1 em{font-style:italic;color:var(--indo)}
.kx-lede{font-size:15px;color:var(--soft);max-width:54ch}
.kx-legend{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.kx-leg{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--soft);background:var(--card);border:1px solid var(--line);border-radius:999px;padding:5px 11px}
.kx-dot{width:9px;height:9px;border-radius:50%;flex:0 0 auto}
.kx-rule{height:1px;background:var(--line);margin:22px 0}
.kx-tabs{display:inline-flex;background:var(--paper2);border:1px solid var(--line);border-radius:11px;padding:3px;gap:3px;margin:0 0 18px}
.kx-tab{font-family:var(--sans);font-size:14px;font-weight:550;color:var(--soft);background:transparent;border:0;border-radius:8px;padding:8px 15px;cursor:pointer}
.kx-tab[data-on=true]{background:var(--card);color:var(--ink);box-shadow:0 1px 0 rgba(0,0,0,.05)}
.kx-panel{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px}
.kx-sub{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);margin:0 0 11px}
.kx-trace{display:flex;align-items:center;gap:0;flex-wrap:wrap;row-gap:8px;min-height:40px}
.kx-node{font-family:var(--serif);font-size:15px;background:var(--paper);border:1px solid var(--line);border-radius:9px;padding:7px 12px;white-space:nowrap}
.kx-you{background:var(--ink);color:var(--paper);border-color:var(--ink);font-style:italic}
.kx-link{width:16px;height:1px;background:var(--faint);flex:0 0 auto}
.kx-chip{display:inline-flex;align-items:center;gap:7px}
.kx-x{appearance:none;border:0;background:transparent;color:var(--faint);cursor:pointer;font-size:15px;line-height:1;padding:2px 0 2px 2px}
.kx-x:hover{color:var(--indo)}
.kx-actions{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}
.kx-mini{font-family:var(--sans);font-size:12.5px;color:var(--soft);background:transparent;border:1px solid var(--line);border-radius:8px;padding:6px 11px;cursor:pointer}
.kx-mini:hover{border-color:var(--faint);color:var(--ink)}
.kx-palette{margin-top:16px}
.kx-pgroup{margin-bottom:12px}
.kx-plabel{font-size:11px;color:var(--faint);letter-spacing:.04em;margin-bottom:7px}
.kx-pbtns{display:flex;gap:7px;flex-wrap:wrap}
.kx-step{font-family:var(--sans);font-size:13.5px;font-weight:500;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:999px;padding:7px 13px;cursor:pointer;transition:transform .08s ease,border-color .12s,color .12s}
.kx-step:hover{border-color:var(--indo);color:var(--indo)}
.kx-step:active{transform:translateY(1px)}
.kx-examples{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}
.kx-ex{font-family:var(--serif);font-style:italic;font-size:13.5px;color:var(--drav);background:var(--dravFill);border:1px solid var(--dravLine);border-radius:999px;padding:5px 12px;cursor:pointer}
.kx-ex:hover{filter:brightness(.97)}
.kx-result{margin-top:18px;animation:kxin .28s ease}
@keyframes kxin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.kx-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
.kx-word{font-family:var(--serif);font-weight:600;font-size:clamp(22px,5.2vw,30px);line-height:1.08;letter-spacing:-.01em}
.kx-tag{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);border:1px solid var(--line);border-radius:6px;padding:4px 8px;white-space:nowrap;margin-top:6px}
.kx-struct{display:flex;gap:10px;background:var(--paper2);border:1px solid var(--line);border-left:3px solid var(--drav);border-radius:10px;padding:11px 13px;margin:14px 0 4px;font-size:13.5px;color:var(--ink)}
.kx-struct b{color:var(--drav);font-weight:600}
.kx-struct .mk{font-family:var(--serif);font-style:italic;flex:0 0 auto;color:var(--drav)}
.kx-fam{margin-top:18px}
.kx-famhd{display:flex;align-items:center;gap:9px;margin-bottom:10px}
.kx-famhd h4{font-family:var(--sans);font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}
.kx-famhd .ln{height:1px;flex:1;background:var(--line)}
.kx-rows{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:11px;overflow:hidden}
.kx-row{display:grid;grid-template-columns:96px 1fr;gap:12px;background:var(--card);padding:11px 13px;align-items:baseline}
.kx-lang{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--soft)}
.kx-term{display:flex;flex-direction:column;gap:2px}
.kx-roman{font-family:var(--serif);font-size:18px;line-height:1.15;font-weight:500}
.kx-native{font-size:15px;color:var(--soft);line-height:1.2}
.kx-note{font-size:11.5px;color:var(--faint);line-height:1.3}
.kx-mk{display:inline-block;font-size:10px;font-family:var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--drav);background:var(--dravFill);border:1px solid var(--dravLine);border-radius:5px;padding:1px 5px;margin-left:6px;vertical-align:middle}
.kx-mk.sib{color:var(--indo);background:var(--indoFill);border-color:var(--indoLine)}
.kx-none{background:var(--paper2);border:1px dashed var(--line);border-radius:12px;padding:16px;font-size:14px;color:var(--soft);margin-top:18px}
.kx-none .g{font-family:var(--serif);font-style:italic;color:var(--ink);font-size:17px;display:block;margin-bottom:6px}
.kx-ctrls{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:18px 0 0}
.kx-langfilter{display:flex;gap:6px;flex-wrap:wrap}
.kx-lf{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--line);background:var(--card);color:var(--faint);border-radius:7px;padding:5px 9px;cursor:pointer}
.kx-lf[data-on=true][data-fam=indo]{color:#fff;background:var(--indo);border-color:var(--indo)}
.kx-lf[data-on=true][data-fam=drav]{color:#fff;background:var(--drav);border-color:var(--drav)}
.kx-lf[data-on=true][data-fam=iran]{color:#fff;background:var(--iran);border-color:var(--iran)}
.kx-lf[data-on=true][data-fam=dard]{color:#fff;background:var(--dard);border-color:var(--dard)}
.kx-toggle{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--soft);cursor:pointer;user-select:none}
.kx-sw{width:34px;height:20px;border-radius:999px;background:var(--line);position:relative;transition:background .15s;flex:0 0 auto}
.kx-sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.kx-sw[data-on=true]{background:var(--drav)}
.kx-sw[data-on=true]::after{left:16px}
.kx-search{width:100%;font-family:var(--sans);font-size:16px;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:11px;padding:12px 14px;margin-bottom:6px}
.kx-search::placeholder{color:var(--faint)}
.kx-cat{margin-top:22px}
.kx-cathd{font-family:var(--serif);font-size:20px;font-weight:600;letter-spacing:-.01em;margin-bottom:3px}
.kx-catintro{font-size:13px;color:var(--soft);margin-bottom:12px;max-width:62ch}
.kx-acc{border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-bottom:8px;background:var(--card)}
.kx-accbtn{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;background:transparent;border:0;cursor:pointer;padding:13px 15px;text-align:left}
.kx-accbtn:hover{background:var(--paper2)}
.kx-acclabel{font-family:var(--serif);font-size:17px;font-weight:500}
.kx-accmeta{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.kx-accbody{padding:2px 15px 16px;border-top:1px solid var(--line)}
.kx-caret{color:var(--faint);font-size:13px;transition:transform .15s}
.kx-caret[data-open=true]{transform:rotate(90deg)}
.kx-foot{margin-top:34px;font-size:12px;color:var(--faint);line-height:1.6}
.kx-foot b{color:var(--soft)}
.kx-foot a{color:var(--drav);text-decoration:none;border-bottom:1px solid var(--dravLine)}
@media (max-width:430px){.kx-row{grid-template-columns:88px 1fr;gap:9px}.kx-roman{font-size:17px}}
@media (prefers-reduced-motion:reduce){.kx-result{animation:none}.kx-caret,.kx-sw,.kx-sw::after,.kx-step{transition:none}}
.kx-dash{color:var(--faint);font-style:italic;font-weight:400}
.kx-lesson{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:14px}
.kx-lnum{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
.kx-lh{font-family:var(--serif);font-size:21px;font-weight:600;letter-spacing:-.01em;margin:2px 0 8px}
.kx-lp{font-size:14px;color:var(--soft);max-width:64ch;margin-bottom:12px}
.kx-lp b{color:var(--ink)}
.kx-build{background:var(--paper2);border:1px solid var(--line);border-radius:12px;padding:14px}
.kx-bpick{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center}
.kx-seg{display:inline-flex;background:var(--paper);border:1px solid var(--line);border-radius:9px;padding:2px;gap:2px}
.kx-segb{font-family:var(--sans);font-size:12.5px;font-weight:550;color:var(--soft);background:transparent;border:0;border-radius:7px;padding:6px 11px;cursor:pointer}
.kx-segb[data-on=true]{background:var(--card);color:var(--ink);box-shadow:0 1px 0 rgba(0,0,0,.05)}
.kx-formula{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;padding:14px 8px;text-align:center}
.kx-morph{display:flex;flex-direction:column;align-items:center;gap:3px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 14px;min-width:84px}
.kx-morph .pre{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint)}
.kx-morph .val{font-family:var(--serif);font-size:19px;font-weight:600}
.kx-morph.indo .val{color:var(--indo)}
.kx-morph.drav .val{color:var(--drav)}
.kx-plus{font-family:var(--serif);font-size:22px;color:var(--faint)}
.kx-eq{font-family:var(--serif);font-size:22px;color:var(--faint)}
.kx-out{display:flex;flex-direction:column;align-items:center;gap:3px;background:var(--ink);border-radius:10px;padding:10px 16px}
.kx-out .pre{font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#cdbfa6}
.kx-out .val{font-family:var(--serif);font-size:21px;font-weight:600;color:var(--paper)}
.kx-out .nat{font-size:14px;color:#d8ccb6}
.kx-mtable{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:11px;overflow:hidden;margin-top:8px}
.kx-mrow{display:grid;grid-template-columns:1.1fr .9fr .9fr 1.3fr;gap:10px;background:var(--card);padding:9px 12px;align-items:baseline;font-size:13px}
.kx-mrow.h{background:var(--paper2);font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}
.kx-mlang{font-weight:600}
.kx-mword{font-family:var(--serif);font-size:15px;font-weight:500}
.kx-pairs{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.kx-pair{display:flex;align-items:center;justify-content:center;gap:9px;background:var(--paper2);border:1px solid var(--line);border-radius:10px;padding:9px 10px}
.kx-pm{font-family:var(--serif);font-size:16px;font-weight:500}
.kx-parrow{color:var(--faint);font-size:13px}
.kx-pf{font-family:var(--serif);font-size:16px;font-weight:500;color:var(--indo)}
.kx-cog{margin-top:10px;display:flex;flex-direction:column;gap:9px}
.kx-cogrow{background:var(--paper2);border:1px solid var(--line);border-radius:11px;padding:11px 13px}
.kx-cogh{display:flex;align-items:baseline;gap:9px;margin-bottom:5px}
.kx-cogroot{font-family:var(--serif);font-size:17px;font-weight:600}
.kx-cogmean{font-size:12px;color:var(--soft)}
.kx-coglangs{font-size:12.5px;color:var(--soft);line-height:1.5}
.kx-coglangs b{color:var(--ink);font-weight:600}
.kx-quiz{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px}
.kx-qtop{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.kx-qscore{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--soft)}
.kx-qstem{font-size:13px;color:var(--soft);margin-bottom:4px}
.kx-qword{font-family:var(--serif);font-size:clamp(22px,5vw,28px);font-weight:600;letter-spacing:-.01em;margin-bottom:3px}
.kx-qsub{font-size:13px;color:var(--faint);margin-bottom:16px}
.kx-qopts{display:grid;gap:9px}
.kx-qopt{display:flex;align-items:center;gap:11px;width:100%;text-align:left;font-family:var(--serif);font-size:17px;background:var(--paper);border:1px solid var(--line);border-radius:11px;padding:13px 15px;cursor:pointer;transition:border-color .12s,background .12s}
.kx-qopt:hover:not(:disabled){border-color:var(--faint)}
.kx-qopt:disabled{cursor:default}
.kx-qopt .ix{font-family:var(--mono);font-size:11px;color:var(--faint);border:1px solid var(--line);border-radius:6px;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}
.kx-qopt[data-state=correct]{border-color:var(--drav);background:var(--dravFill)}
.kx-qopt[data-state=correct] .ix{border-color:var(--drav);color:var(--drav)}
.kx-qopt[data-state=wrong]{border-color:#b4472f;background:#f6e2db}
.kx-qnext{margin-top:16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.kx-qexpl{font-size:13px;color:var(--soft)}
.kx-btn{font-family:var(--sans);font-size:14px;font-weight:600;color:var(--paper);background:var(--ink);border:0;border-radius:10px;padding:10px 18px;cursor:pointer}
.kx-btn:hover{opacity:.92}
.kx-qlang{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.kx-filter{margin-top:18px;background:var(--paper2);border:1px solid var(--line);border-radius:13px;padding:12px 13px}
.kx-frow{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:10px}
.kx-flabel{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);margin-right:2px}
.kx-fq{font-family:var(--sans);font-size:12.5px;font-weight:600;color:var(--soft);background:var(--card);border:1px solid var(--line);border-radius:8px;padding:6px 11px;cursor:pointer}
.kx-fq[data-on=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.kx-fq[data-on=true][data-fam=indo]{background:var(--indo);border-color:var(--indo)}
.kx-fq[data-on=true][data-fam=drav]{background:var(--drav);border-color:var(--drav)}
.kx-fq[data-on=true][data-fam=iran]{background:var(--iran);border-color:var(--iran)}
.kx-fq[data-on=true][data-fam=dard]{background:var(--dard);border-color:var(--dard)}
.kx-spacer{flex:1;min-width:8px}
.kx-ftoggle,.kx-ntoggle{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;color:var(--soft);cursor:pointer;user-select:none;white-space:nowrap;background:none;border:0;padding:0;margin:0;font-family:inherit;font-style:normal}
.kx-ftoggle:focus-visible,.kx-ntoggle:focus-visible,.kx-lf:focus-visible,.kx-fq:focus-visible,.kx-step:focus-visible,.kx-qopt:focus-visible,.kx-tab:focus-visible,.kx-mini:focus-visible,.kx-btn:focus-visible,.kx-ex:focus-visible,.kx-segb:focus-visible,.kx-x:focus-visible{outline:2px solid var(--drav);outline-offset:2px}
.kx-vh{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.kx-node.kx-eq{background:var(--ink);color:var(--paper);border-color:var(--ink);font-weight:600}
.kx-byname{font-style:italic;color:var(--faint) !important;font-weight:400 !important}
.kx-count{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint)}
.kx-cognate{text-decoration:underline dotted;text-decoration-color:#bda981;text-underline-offset:3px;text-decoration-thickness:1.5px}
.kx-cogcap{margin-top:9px;font-size:11.5px;color:var(--faint);font-style:italic;display:flex;align-items:center;gap:6px}
.kx-cogcap::before{content:"";width:16px;border-bottom:1.5px dotted #bda981;display:inline-block}
.kx-thin{font-family:var(--mono);font-size:8.5px;letter-spacing:.04em;text-transform:uppercase;color:#9a7b3a;border:1px solid #d8c39a;border-radius:4px;padding:0 3px;margin-left:5px;vertical-align:middle}
.kx-caveat{margin:0 0 12px;font-size:12px;color:#8a6d2e;background:#fbf3df;border:1px solid #e6d4a8;border-radius:8px;padding:8px 11px;line-height:1.45}
.kx-sw.sm{width:30px;height:18px}
.kx-sw.sm::after{width:14px;height:14px}
.kx-sw.sm[data-on=true]::after{left:14px}
.kx-fhint{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;font-size:12px;color:var(--faint);font-style:italic}
.kx-lf{transition:background .1s,border-color .1s}
@media (max-width:430px){.kx-mrow{grid-template-columns:1fr 1fr;gap:6px 10px}.kx-pairs{grid-template-columns:1fr}}
html{-webkit-text-size-adjust:100%}
.kx button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
@media (max-width:480px){
.kx-wrap{padding:18px 13px 56px}
.kx-tabs{display:flex;width:100%}
.kx-tab{flex:1;padding:8px 4px;font-size:13px;text-align:center}
.kx-lf{padding:8px 11px}
.kx-fq{padding:8px 12px}
.kx-step{padding:9px 14px}
.kx-x{padding:6px 4px;font-size:17px}
.kx-ftoggle,.kx-ntoggle{padding:6px 0}
.kx-qopt{padding:13px 12px;font-size:16px}
}
@media (max-width:430px){
.kx-panel,.kx-quiz,.kx-lesson{padding:15px 13px}
.kx-accbody{padding:2px 13px 14px}
.kx-node{font-size:14px;padding:6px 10px}
.kx-link{width:12px}
.kx-lang{font-size:9.5px;letter-spacing:.05em;overflow-wrap:anywhere}
.kx-leg{font-size:11px;padding:4px 9px}
.kx-struct{padding:10px 11px;font-size:13px}
.kx-morph{min-width:72px;padding:9px 11px}
.kx-morph .val{font-size:17px}
.kx-cathd{font-size:18px}
}
`;

const LANGS = [
  { id: "hi", name: "Hindi", fam: "indo" },
  { id: "ur", name: "Urdu", fam: "indo" },
  { id: "bnbd", name: "Bengali (Bangladesh)", fam: "indo" },
  { id: "bnwb", name: "Bengali (W. Bengal)", fam: "indo" },
  { id: "syl", name: "Sylheti", fam: "indo" },
  { id: "pa", name: "Punjabi (India)", fam: "indo" },
  { id: "paPk", name: "Punjabi (Pakistan)", fam: "indo" },
  { id: "skr", name: "Saraiki", fam: "indo" },
  { id: "gu", name: "Gujarati", fam: "indo" },
  { id: "mr", name: "Marathi", fam: "indo" },
  { id: "ne", name: "Nepali", fam: "indo" },
  { id: "sd", name: "Sindhi", fam: "indo" },
  { id: "rhg", name: "Rohingya", fam: "indo" },
  { id: "ctg", name: "Chittagonian", fam: "indo" },
  { id: "od", name: "Odia", fam: "indo" },
  { id: "asm", name: "Assamese", fam: "indo" },
  { id: "ks", name: "Kashmiri", fam: "dard" },
  { id: "ps", name: "Pashto", fam: "iran" },
  { id: "bal", name: "Balochi", fam: "iran" },
  { id: "dari", name: "Dari", fam: "iran" },
  { id: "ta", name: "Tamil", fam: "drav" },
  { id: "te", name: "Telugu", fam: "drav" },
  { id: "kn", name: "Kannada", fam: "drav" },
  { id: "ml", name: "Malayalam", fam: "drav" },
];
const FAM = {
  indo: { name: "Indo-Aryan", color: "var(--indo)" },
  dard: { name: "Dardic", color: "var(--dard)" },
  iran: { name: "Iranian", color: "var(--iran)" },
  drav: { name: "Dravidian", color: "var(--drav)" },
};
const FAM_ORDER = ["indo", "dard", "iran", "drav"];
const t = (r, n) => (n ? { r, n } : { r });
const tnote = (r, n, note) => ({ r, n, note });
const X = "marriageable cross-cousin";

const REL = [
  { id: "father", cat: "parents", paths: ["F"], label: "Father",
    terms: { hi: t("Pita / Papa", "पिता"), ur: t("Abba / Walid", "ابّا"), pa: t("Pita / Bapu", "ਪਿਤਾ"), gu: t("Bapuji / Papa", "બાપુજી"), mr: t("Vadil / Baba", "वडील"), ta: t("Appa", "அப்பா"), te: t("Nanna", "నాన్న") } },
  { id: "mother", cat: "parents", paths: ["M"], label: "Mother",
    terms: { hi: t("Maa", "माँ"), ur: t("Ammi", "امّی"), pa: t("Maa / Bebe", "ਮਾਂ"), gu: t("Ba / Maa", "બા"), mr: t("Aai", "आई"), ta: t("Amma", "அம்மா"), te: t("Amma", "అమ్మ") } },

  { id: "dada", cat: "grand", paths: ["F-F"], label: "Father's father",
    terms: { hi: t("Dada", "दादा"), ur: t("Dada", "دادا"), pa: t("Dada", "ਦਾਦਾ"), gu: t("Dada", "દાદા"), mr: t("Ajoba", "आजोबा"), ta: t("Thatha", "தாத்தா"), te: t("Thatha", "తాత") } },
  { id: "dadi", cat: "grand", paths: ["F-M"], label: "Father's mother",
    terms: { hi: t("Dadi", "दादी"), ur: t("Dadi", "دادی"), pa: t("Dadi", "ਦਾਦੀ"), gu: t("Dadi / Ba", "દાદી"), mr: t("Aaji", "आजी"), ta: t("Paati", "பாட்டி"), te: t("Nanamma", "నాన్నమ్మ") } },
  { id: "nana", cat: "grand", paths: ["M-F"], label: "Mother's father",
    terms: { hi: t("Nana", "नाना"), ur: t("Nana", "نانا"), pa: t("Nana", "ਨਾਨਾ"), gu: t("Nana", "નાના"), mr: t("Nana / Ajoba", "नाना"), ta: t("Thatha", "தாத்தா"), te: t("Thatha", "తాత") } },
  { id: "nani", cat: "grand", paths: ["M-M"], label: "Mother's mother",
    terms: { hi: t("Nani", "नानी"), ur: t("Nani", "نانی"), pa: t("Nani", "ਨਾਨੀ"), gu: t("Nani", "નાની"), mr: t("Nani / Aaji", "नानी"), ta: t("Paati / Ammamma", "பாட்டி"), te: t("Ammamma", "అమ్మమ్మ") } },

  { id: "taya", cat: "fside", paths: ["F-Be"], label: "Father's elder brother",
    struct: "Gujarati uses one word (Kaka) for every father's brother — the eldest is Mota Kaka. Hindi/Urdu/Punjabi split it (Tau vs Chacha), and so do Tamil and Telugu (Periyappa vs Chithappa).",
    terms: { hi: t("Tau / Taya", "ताऊ"), ur: t("Taya", "تایا"), pa: t("Taya", "ਤਾਇਆ"), gu: t("Mota Kaka", "મોટા કાકા"), mr: t("Kaka (thorle)", "काका"), ta: t("Periyappa", "பெரியப்பா"), te: t("Peddananna", "పెదనాన్న") } },
  { id: "tai", cat: "fside", paths: ["F-Be-W"], label: "Father's elder brother's wife",
    terms: { hi: t("Tai", "ताई"), ur: t("Tai", "تائی"), pa: t("Tai", "ਤਾਈ"), gu: t("Moti Kaki", "મોટી કાકી"), mr: t("Kaku", "काकू"), ta: t("Periyamma", "பெரியம்மா"), te: t("Peddamma", "పెద్దమ్మ") } },
  { id: "chacha", cat: "fside", paths: ["F-By"], label: "Father's younger brother",
    terms: { hi: t("Chacha", "चाचा"), ur: t("Chacha", "چچا"), pa: t("Chacha", "ਚਾਚਾ"), gu: t("Kaka", "કાકા"), mr: t("Kaka / Chulta", "काका"), ta: t("Chithappa", "சித்தப்பா"), te: t("Babai", "బాబాయి") } },
  { id: "chachi", cat: "fside", paths: ["F-By-W"], label: "Father's younger brother's wife",
    terms: { hi: t("Chachi", "चाची"), ur: t("Chachi", "چچی"), pa: t("Chachi", "ਚਾਚੀ"), gu: t("Kaki", "કાકી"), mr: t("Kaku", "काकू"), ta: t("Chithi", "சித்தி"), te: t("Pinni / Chinnamma", "పిన్ని") } },
  { id: "bua", cat: "fside", paths: ["F-Z", "F-Ze", "F-Zy"], label: "Father's sister",
    struct: "In Tamil and Telugu the father's sister (Athai / Atta) is the prototypical mother-in-law — her child is a preferred marriage partner.",
    terms: { hi: t("Bua / Phuphi", "बुआ"), ur: t("Phupho / Phupi", "پھوپھی"), pa: t("Bhua / Phuphi", "ਭੂਆ"), gu: t("Foi / Faiba", "ફોઈ"), mr: t("Atya", "आत्या"), ta: t("Athai", "அத்தை"), te: t("Atta / Menatta", "అత్త") } },
  { id: "phupha", cat: "fside", paths: ["F-Z-H", "F-Ze-H", "F-Zy-H"], label: "Father's sister's husband",
    struct: "In Dravidian the father's sister's husband is simply Mama — the same word as the mother's brother. Both are the marriage-line uncle.",
    terms: { hi: t("Phupha", "फूफा"), ur: t("Phupha", "پھوپھا"), pa: t("Phuphhar / Fufa", "ਫੁੱਫੜ"), gu: t("Fua / Fuva", "ફુવા"), mr: tnote("Mama", "", "addressed by name; varies"), ta: t("Mama", "மாமா"), te: t("Mama / Mavayya", "మామయ్య") } },

  { id: "mama", cat: "mside", paths: ["M-Br", "M-Be", "M-By"], label: "Mother's brother",
    struct: "In Tamil and Telugu the mother's brother (Mama / Mavayya) is also the word for father-in-law — traditionally you marry his daughter.",
    terms: { hi: t("Mama", "मामा"), ur: t("Mamu(n)", "ماموں"), pa: t("Mama", "ਮਾਮਾ"), gu: t("Mama", "મામા"), mr: t("Mama", "मामा"), ta: t("Mama", "மாமா"), te: t("Mama / Mavayya", "మామయ్య") } },
  { id: "mami", cat: "mside", paths: ["M-Br-W", "M-Be-W", "M-By-W"], label: "Mother's brother's wife",
    struct: "Telugu calls her Atta — the same word as father's sister and mother-in-law, because of cross-cousin marriage.",
    terms: { hi: t("Mami", "मामी"), ur: t("Mumani", "ممانی"), pa: t("Mami", "ਮਾਮੀ"), gu: t("Mami", "મામી"), mr: t("Mami", "मामी"), ta: t("Mami", "மாமி"), te: t("Atta", "అత్త") } },
  { id: "mausi-e", cat: "mside", paths: ["M-Ze"], label: "Mother's elder sister",
    terms: { hi: t("Mausi / Badi Mausi", "मौसी"), ur: t("Khala", "خالہ"), pa: t("Maasi", "ਮਾਸੀ"), gu: t("Moti Masi", "મોટી માસી"), mr: t("Mavshi", "मावशी"), ta: t("Periyamma", "பெரியம்மா"), te: t("Peddamma", "పెద్దమ్మ") } },
  { id: "mausa-e", cat: "mside", paths: ["M-Ze-H"], label: "Mother's elder sister's husband",
    terms: { hi: t("Mausa", "मौसा"), ur: t("Khalu", "خالو"), pa: t("Maasar", "ਮਾਸੜ"), gu: t("Masa", "માસા"), mr: t("Mavsa", "मावसा"), ta: t("Periyappa", "பெரியப்பா"), te: t("Peddananna", "పెదనాన్న") } },
  { id: "mausi-y", cat: "mside", paths: ["M-Zy"], label: "Mother's younger sister",
    struct: "Parallel logic: in Dravidian the mother's younger sister merges with the father's younger brother's wife — both Chithi (Ta) / Pinni (Te).",
    terms: { hi: t("Mausi / Choti Mausi", "मौसी"), ur: t("Khala", "خالہ"), pa: t("Maasi", "ਮਾਸੀ"), gu: t("Masi", "માસી"), mr: t("Mavshi", "मावशी"), ta: t("Chithi", "சித்தி"), te: t("Pinni", "పిన్ని") } },
  { id: "mausa-y", cat: "mside", paths: ["M-Zy-H"], label: "Mother's younger sister's husband",
    terms: { hi: t("Mausa", "मौसा"), ur: t("Khalu", "خالو"), pa: t("Maasar", "ਮਾਸੜ"), gu: t("Masa", "માસા"), mr: t("Mavsa", "मावसा"), ta: t("Chithappa", "சித்தப்பா"), te: t("Babai", "బాబాయి") } },

  { id: "bbro", cat: "sib", paths: ["Be"], label: "Elder brother",
    terms: { hi: t("Bhaiya / Bada Bhai", "भैया"), ur: t("Bhai / Bara Bhai", "بھائی"), pa: t("Bhaji / Vadda Bhra", "ਭਾਜੀ"), gu: t("Mota Bhai", "મોટાભાઈ"), mr: t("Dada", "दादा"), ta: t("Annan", "அண்ணன்"), te: t("Annayya", "అన్నయ్య") } },
  { id: "ybro", cat: "sib", paths: ["By"], label: "Younger brother",
    terms: { hi: t("Chhota Bhai", "छोटा भाई"), ur: t("Chhota Bhai", "چھوٹا بھائی"), pa: t("Nikka Bhra", "ਨਿੱਕਾ ਭਰਾ"), gu: t("Nano Bhai", "નાનો ભાઈ"), mr: t("Bhau", "भाऊ"), ta: t("Thambi", "தம்பி"), te: t("Thammudu", "తమ్ముడు") } },
  { id: "bsis", cat: "sib", paths: ["Ze"], label: "Elder sister",
    terms: { hi: t("Didi", "दीदी"), ur: t("Baji / Aapa", "باجی"), pa: t("Bhain ji / Didi", "ਭੈਣ ਜੀ"), gu: t("Moti Ben / Didi", "મોટી બેન"), mr: t("Tai", "ताई"), ta: t("Akka", "அக்கா"), te: t("Akka", "అక్క") } },
  { id: "ysis", cat: "sib", paths: ["Zy"], label: "Younger sister",
    terms: { hi: t("Chhoti Bahan", "छोटी बहन"), ur: t("Chhoti Bahan", "چھوٹی بہن"), pa: t("Nikki Bhain", "ਨਿੱਕੀ ਭੈਣ"), gu: t("Nani Ben", "નાની બેન"), mr: t("Bahin", "बहीण"), ta: t("Thangachi", "தங்கச்சி"), te: t("Chellelu", "చెల్లెలు") } },

  { id: "bhabhi", cat: "sibsp", paths: ["Be-W", "By-W"], label: "Brother's wife",
    terms: { hi: t("Bhabhi", "भाभी"), ur: t("Bhabhi", "بھابھی"), pa: t("Bhabhi / Bharjai", "ਭਰਜਾਈ"), gu: t("Bhabhi", "ભાભી"), mr: t("Vahini", "वहिनी"), ta: t("Anni", "அண்ணி"), te: t("Vadina", "వదిన") } },
  { id: "jija", cat: "sibsp", paths: ["Ze-H", "Zy-H"], label: "Sister's husband",
    terms: { hi: t("Jija / Jijaji", "जीजा"), ur: t("Behnoi", "بہنوئی"), pa: t("Jija / Bharva", "ਜੀਜਾ"), gu: t("Banevi / Jijaji", "બનેવી"), mr: t("Dada / Bhaoji", "दाजी"), ta: t("Athimber / Machaan", "அத்திம்பேர்"), te: t("Bava", "బావ") } },

  { id: "husband", cat: "partner", paths: ["H"], label: "Husband",
    terms: { hi: t("Pati", "पति"), ur: t("Shauhar", "شوہر"), pa: t("Pati / Gharwala", "ਪਤੀ"), gu: t("Pati", "પતિ"), mr: t("Navra / Pati", "नवरा"), ta: t("Kanavan", "கணவன்"), te: t("Bharta / Mogudu", "భర్త") } },
  { id: "wife", cat: "partner", paths: ["W"], label: "Wife",
    terms: { hi: t("Patni", "पत्नी"), ur: t("Biwi", "بیوی"), pa: t("Patni / Gharwali", "ਪਤਨੀ"), gu: t("Patni", "પત્ની"), mr: t("Bayko", "बायको"), ta: t("Manaivi", "மனைவி"), te: t("Bharya / Pellam", "భార్య") } },
  { id: "sasur", cat: "partner", paths: ["H-F", "W-F"], label: "Father-in-law",
    terms: { hi: t("Sasur", "ससुर"), ur: t("Susar", "سُسر"), pa: t("Sauhra", "ਸਹੁਰਾ"), gu: t("Sasra", "સસરા"), mr: t("Sasra", "सासरे"), ta: t("Mamanar / Mama", "மாமனார்"), te: t("Mamagaru", "మామగారు") } },
  { id: "saas", cat: "partner", paths: ["H-M", "W-M"], label: "Mother-in-law",
    terms: { hi: t("Saas", "सास"), ur: t("Saas", "ساس"), pa: t("Sass", "ਸੱਸ"), gu: t("Sasu", "સાસુ"), mr: t("Sasu", "सासू"), ta: t("Maamiyaar / Athai", "மாமியார்"), te: t("Attagaru", "అత్తగారు") } },
  { id: "jeth", cat: "partner", paths: ["H-Be"], label: "Husband's elder brother",
    terms: { hi: t("Jeth", "जेठ"), ur: t("Jeth", "جیٹھ"), pa: t("Jeth", "ਜੇਠ"), gu: t("Jeth", "જેઠ"), mr: t("Bhaoji / Dir", "भावोजी"), ta: tnote("Maithunan", "மைத்துனன்", "varies by region"), te: tnote("Bava", "బావ", "varies") } },
  { id: "devar", cat: "partner", paths: ["H-By"], label: "Husband's younger brother",
    terms: { hi: t("Devar", "देवर"), ur: t("Dewar", "دیور"), pa: t("Dewar", "ਦਿਓਰ"), gu: t("Diyar", "દિયર"), mr: t("Dir", "दीर"), ta: tnote("Kozhundhan", "கொழுந்தன்", "varies"), te: t("Maridi", "మరిది") } },
  { id: "nanad", cat: "partner", paths: ["H-Z", "H-Ze", "H-Zy"], label: "Husband's sister",
    terms: { hi: t("Nanad", "ननद"), ur: t("Nand", "نند"), pa: t("Nanaan", "ਨਨਾਣ"), gu: t("Nanand", "નણંદ"), mr: t("Nanand", "ननंद"), ta: t("Nathanar", "நாத்தனார்"), te: t("Aadapaduchu", "ఆడపడుచు") } },
  { id: "sala", cat: "partner", paths: ["W-Br", "W-Be", "W-By"], label: "Wife's brother",
    terms: { hi: t("Sala", "साला"), ur: t("Sala", "سالا"), pa: t("Sala", "ਸਾਲਾ"), gu: t("Sala", "સાળા"), mr: t("Mehuna", "मेहुणा"), ta: t("Machaan / Maithunan", "மச்சான்"), te: t("Bava-maridi", "బావ") } },
  { id: "sali", cat: "partner", paths: ["W-Z", "W-Ze", "W-Zy"], label: "Wife's sister",
    terms: { hi: t("Sali", "साली"), ur: t("Sali", "سالی"), pa: t("Sali", "ਸਾਲੀ"), gu: t("Sali", "સાળી"), mr: t("Mehuni", "मेहुणी"), ta: tnote("Machini", "மச்சினி", "varies"), te: t("Maradalu", "మరదలు") } },

  { id: "son", cat: "child", paths: ["S"], label: "Son",
    terms: { hi: t("Beta", "बेटा"), ur: t("Beta", "بیٹا"), pa: t("Putt", "ਪੁੱਤ"), gu: t("Dikro", "દીકરો"), mr: t("Mulga", "मुलगा"), ta: t("Magan", "மகன்"), te: t("Koduku", "కొడుకు") } },
  { id: "daughter", cat: "child", paths: ["D"], label: "Daughter",
    terms: { hi: t("Beti", "बेटी"), ur: t("Beti", "بیٹی"), pa: t("Dhee", "ਧੀ"), gu: t("Dikri", "દીકરી"), mr: t("Mulgi", "मुलगी"), ta: t("Magal", "மகள்"), te: t("Kuturu", "కూతురు") } },
  { id: "bahu", cat: "child", paths: ["S-W"], label: "Son's wife (daughter-in-law)",
    terms: { hi: t("Bahu", "बहू"), ur: t("Bahu", "بہو"), pa: t("Nuanh", "ਨੂੰਹ"), gu: t("Vahu", "વહુ"), mr: t("Soon", "सून"), ta: t("Marumagal", "மருமகள்"), te: t("Kodalu", "కోడలు") } },
  { id: "damad", cat: "child", paths: ["D-H"], label: "Daughter's husband (son-in-law)",
    terms: { hi: t("Damad", "दामाद"), ur: t("Damad", "داماد"), pa: t("Jawai", "ਜਵਾਈ"), gu: t("Jamai", "જમાઈ"), mr: t("Jawai", "जावई"), ta: t("Marumagan / Maappillai", "மருமகன்"), te: t("Alludu", "అల్లుడు") } },

  { id: "bhatija", cat: "niece", paths: ["Be-S", "By-S"], label: "Brother's son",
    terms: { hi: t("Bhatija", "भतीजा"), ur: t("Bhatija", "بھتیجا"), pa: t("Bhatija", "ਭਤੀਜਾ"), gu: t("Bhatrijo", "ભત્રીજો"), mr: t("Putanya", "पुतण्या"), ta: tnote("by name", "", "own-line; usually by name"), te: tnote("by name", "", "own-line") } },
  { id: "bhatiji", cat: "niece", paths: ["Be-D", "By-D"], label: "Brother's daughter",
    terms: { hi: t("Bhatiji", "भतीजी"), ur: t("Bhatiji", "بھتیجی"), pa: t("Bhatiji", "ਭਤੀਜੀ"), gu: t("Bhatriji", "ભત્રીજી"), mr: t("Putni / Bhachi", "पुतणी"), ta: tnote("by name", "", "own-line"), te: tnote("by name", "", "own-line") } },
  { id: "bhanja", cat: "niece", paths: ["Ze-S", "Zy-S"], label: "Sister's son",
    struct: "For a man, a Dravidian sister's son is Marumagan / Menalludu — literally the son-in-law word, because he's the preferred husband for one's daughter.",
    terms: { hi: t("Bhanja", "भांजा"), ur: t("Bhanja", "بھانجا"), pa: t("Bhanja", "ਭਾਣਜਾ"), gu: t("Bhanej", "ભાણેજ"), mr: t("Bhacha", "भाचा"), ta: t("Marumagan", "மருமகன்"), te: t("Menalludu", "మేనల్లుడు") } },
  { id: "bhanji", cat: "niece", paths: ["Ze-D", "Zy-D"], label: "Sister's daughter",
    terms: { hi: t("Bhanji", "भांजी"), ur: t("Bhanji", "بھانجی"), pa: t("Bhanji", "ਭਾਣਜੀ"), gu: t("Bhanji", "ભાણી"), mr: t("Bhachi", "भाची"), ta: t("Marumagal", "மருமகள்"), te: t("Menakodalu", "మేనకోడలు") } },

  { id: "pota", cat: "grandchild", paths: ["S-S"], label: "Son's son",
    terms: { hi: t("Pota", "पोता"), ur: t("Pota", "پوتا"), pa: t("Pota", "ਪੋਤਾ"), gu: t("Pautra", "પૌત્ર"), mr: t("Natu", "नातू"), ta: t("Peran", "பேரன்"), te: t("Manavadu", "మనవడు") } },
  { id: "poti", cat: "grandchild", paths: ["S-D"], label: "Son's daughter",
    terms: { hi: t("Poti", "पोती"), ur: t("Poti", "پوتی"), pa: t("Poti", "ਪੋਤੀ"), gu: t("Pautri", "પૌત્રી"), mr: t("Nat", "नात"), ta: t("Petti", "பேத்தி"), te: t("Manavaralu", "మనవరాలు") } },
  { id: "nawasa", cat: "grandchild", paths: ["D-S"], label: "Daughter's son",
    terms: { hi: t("Nati / Nawasa", "नाती"), ur: t("Nawasa", "نواسا"), pa: t("Dohta", "ਦੋਹਤਾ"), gu: t("Dohitro", "દોહિત્રો"), mr: t("Natu", "नातू"), ta: t("Peran", "பேரன்"), te: t("Manavadu", "మనవడు") } },
  { id: "nawasi", cat: "grandchild", paths: ["D-D"], label: "Daughter's daughter",
    terms: { hi: t("Natin / Nawasi", "नातिन"), ur: t("Nawasi", "نواسی"), pa: t("Dohti", "ਦੋਹਤੀ"), gu: t("Dohitri", "દોહિત્રી"), mr: t("Nat", "नात"), ta: t("Petti", "பேத்தி"), te: t("Manavaralu", "మనవరాలు") } },

  { id: "fbs", cat: "cousin", paths: ["F-Be-S", "F-By-S"], label: "Father's brother's son",
    struct: "Parallel cousin — in Dravidian he is your brother (Annan / Thambi) and never marriageable.",
    terms: { hi: t("Chachera / Taozaad Bhai", "चचेरा भाई"), ur: t("Chachazad Bhai", "چچازاد بھائی"), pa: t("Chachera Bhra", "ਚਚੇਰਾ ਭਰਾ"), gu: t("Kakano Bhai", "કાકાનો ભાઈ"), mr: t("Chulat Bhau", "चुलत भाऊ"), ta: tnote("Annan / Thambi", "அண்ணன் / தம்பி", "= brother"), te: tnote("Annayya / Thammudu", "అన్నయ్య", "= brother") } },
  { id: "fbd", cat: "cousin", paths: ["F-Be-D", "F-By-D"], label: "Father's brother's daughter",
    struct: "Parallel cousin — treated and named as your own sister.",
    terms: { hi: t("Chacheri Bahan", "चचेरी बहन"), ur: t("Chachazad Bahan", "چچازاد بہن"), pa: t("Chacheri Bhain", "ਚਚੇਰੀ ਭੈਣ"), gu: t("Kakani Ben", "કાકાની બેન"), mr: t("Chulat Bahin", "चुलत बहीण"), ta: tnote("Akka / Thangai", "அக்கா / தங்கை", "= sister"), te: tnote("Akka / Chellelu", "అక్క", "= sister") } },
  { id: "mss", cat: "cousin", paths: ["M-Ze-S", "M-Zy-S"], label: "Mother's sister's son",
    struct: "Parallel cousin — a sibling in Dravidian, not a match.",
    terms: { hi: t("Mausera Bhai", "मौसेरा भाई"), ur: t("Khalazad Bhai", "خالہ زاد بھائی"), pa: t("Maasera Bhra", "ਮਾਸੇਰਾ ਭਰਾ"), gu: t("Masiyai Bhai", "મસિયાઈ ભાઈ"), mr: t("Mavas Bhau", "मावस भाऊ"), ta: tnote("Annan / Thambi", "அண்ணன்", "= brother"), te: tnote("Annayya / Thammudu", "అన్నయ్య", "= brother") } },
  { id: "msd", cat: "cousin", paths: ["M-Ze-D", "M-Zy-D"], label: "Mother's sister's daughter",
    struct: "Parallel cousin — a sister in Dravidian.",
    terms: { hi: t("Mauseri Bahan", "मौसेरी बहन"), ur: t("Khalazad Bahan", "خالہ زاد بہن"), pa: t("Maaseri Bhain", "ਮਾਸੇਰੀ ਭੈਣ"), gu: t("Masiyai Ben", "મસિયાઈ બેન"), mr: t("Mavas Bahin", "मावस बहीण"), ta: tnote("Akka / Thangai", "அக்கா", "= sister"), te: tnote("Akka / Chellelu", "అక్క", "= sister") } },
  { id: "fzs", cat: "cousin", paths: ["F-Z-S", "F-Ze-S", "F-Zy-S"], label: "Father's sister's son",
    struct: "Cross cousin — traditionally marriageable. In Dravidian he's Attan / Machaan (Ta) or Bava (Te), the same words used for a brother-in-law.",
    terms: { hi: t("Phuphera Bhai", "फुफेरा भाई"), ur: t("Phuphizad Bhai", "پھوپھی زاد"), pa: t("Phuphera Bhra", "ਫੁਫੇਰਾ ਭਰਾ"), gu: t("Foino Bhai", "ફોઈનો ભાઈ"), mr: t("Atte Bhau", "आते भाऊ"), ta: tnote("Attan / Machaan", "அத்தான்", X), te: tnote("Bava", "బావ", X) } },
  { id: "fzd", cat: "cousin", paths: ["F-Z-D", "F-Ze-D", "F-Zy-D"], label: "Father's sister's daughter",
    struct: "Cross cousin — marriageable in the Dravidian system.",
    terms: { hi: t("Phupheri Bahan", "फुफेरी बहन"), ur: t("Phuphizad Bahan", "پھوپھی زاد"), pa: t("Phupheri Bhain", "ਫੁਫੇਰੀ ਭੈਣ"), gu: t("Foini Ben", "ફોઈની બેન"), mr: t("Atte Bahin", "आते बहीण"), ta: tnote("Machini / Athachi", "மச்சினி", X), te: tnote("Vadina / Maradalu", "వదిన", X) } },
  { id: "mbs", cat: "cousin", paths: ["M-Br-S", "M-Be-S", "M-By-S"], label: "Mother's brother's son",
    struct: "The classic preferred match: you marry your mother's brother's child. In Dravidian he's named like an in-law — Attan / Machaan (Ta), Bava (Te).",
    terms: { hi: t("Mamera Bhai", "ममेरा भाई"), ur: t("Mamuzad Bhai", "ماموں زاد"), pa: t("Mamera Bhra", "ਮਮੇਰਾ ਭਰਾ"), gu: t("Mamano Bhai", "મામાનો ભાઈ"), mr: t("Mame Bhau", "मामे भाऊ"), ta: tnote("Attan / Machaan", "அத்தான்", X), te: tnote("Bava", "బావ", X) } },
  { id: "mbd", cat: "cousin", paths: ["M-Br-D", "M-Be-D", "M-By-D"], label: "Mother's brother's daughter",
    struct: "Cross cousin — the prototypical bride in the Dravidian system.",
    terms: { hi: t("Mameri Bahan", "ममेरी बहन"), ur: t("Mamuzad Bahan", "ماموں زاد"), pa: t("Mameri Bhain", "ਮਮੇਰੀ ਭੈਣ"), gu: t("Mamani Ben", "મામાની બેન"), mr: t("Mame Bahin", "मामे बहीण"), ta: tnote("Machini", "மச்சினி", X), te: tnote("Vadina / Maradalu", "వదిన", X) } },
];

/* New languages layered on top (verified core; gaps render as "—").
 * ne Nepali · sd Sindhi · od Odia · asm Assamese (Indo-Aryan)
 * kn Kannada · ml Malayalam (Dravidian) */
const EXTRA = {
  father: { ne: t("Buwa / Baba", "बुबा"), sd: t("Piu / Baba", "پيءُ"), od: t("Bapa", "ବାପା"), asm: t("Deuta / Pita", "দেউতা"), kn: t("Appa", "ಅಪ್ಪ"), ml: t("Achan", "അച്ഛൻ") },
  mother: { ne: t("Aama", "आमा"), sd: t("Maau", "ماءُ"), od: t("Maa", "ମା"), asm: t("Aai / Maa", "আই"), kn: t("Amma", "ಅಮ್ಮ"), ml: t("Amma", "അമ്മ") },

  dada: { ne: t("Hajurbuwa", "हजुरबुबा"), sd: t("Dado", "ڏاڏو"), od: tnote("Jeje", "ଜେଜେ", "or Thakurda"), asm: t("Koka", "ককা"), kn: t("Ajja / Thatha", "ಅಜ್ಜ"), ml: t("Appooppan", "അപ്പൂപ്പൻ") },
  dadi: { ne: t("Hajurama", "हजुरआमा"), sd: t("Dadi", "ڏاڏي"), od: tnote("Jeje Maa", "ଜେଜେ ମା", "or Thakurma"), asm: t("Aaita", "আইতা"), kn: t("Ajji", "ಅಜ್ಜಿ"), ml: t("Ammumma", "അമ്മൂമ്മ") },
  nana: { ne: t("Hajurbuwa", "हजुरबुबा"), sd: t("Nano", "نانو"), od: t("Aja", "ଆଜା"), asm: t("Koka", "ককা"), kn: t("Ajja / Thatha", "ಅಜ್ಜ"), ml: t("Appooppan", "അപ്പൂപ്പൻ") },
  nani: { ne: t("Hajurama", "हजुरआमा"), sd: t("Nani", "ناني"), od: t("Aai", "ଆଈ"), asm: t("Aaita / Abu", "আইতা"), kn: t("Ajji", "ಅಜ್ಜಿ"), ml: t("Ammumma", "അമ്മൂമ്മ") },

  taya: { ne: t("Thulobuwa", "ठुलोबुबा"), sd: tnote("Chacho", "چاچو", "elder: prefix vaḍo-"), od: t("Bada Bapa", "ବଡ଼ବାପା"), asm: t("Bordeuta / Jetha", "বৰদেউতা"), kn: t("Doddappa", "ದೊಡ್ಡಪ್ಪ"), ml: t("Valyachan", "വല്യച്ഛൻ") },
  tai: { ne: t("Thuli Aama", "ठुली आमा"), sd: t("Chachi", "چاچي"), od: t("Bada Maa", "ବଡ଼ ମା"), asm: t("Borma / Jethi", "বৰমা"), kn: t("Doddamma", "ದೊಡ್ಡಮ್ಮ"), ml: t("Valyamma", "വല്യമ്മ") },
  chacha: { ne: t("Kaka", "काका"), sd: t("Kaako / Chacho", "چاچو"), od: tnote("Kaka", "କକା", "or Sana Bapa"), asm: t("Khura", "খুড়া"), kn: t("Chikkappa", "ಚಿಕ್ಕಪ್ಪ"), ml: t("Cheriyachan / Kochachan", "ചെറിയച്ഛൻ") },
  chachi: { ne: t("Kaki", "काकी"), sd: t("Chachi", "چاچي"), od: t("Kaki", "କକି"), asm: t("Khuri", "খুড়ী"), kn: t("Chikkamma", "ಚಿಕ್ಕಮ್ಮ"), ml: t("Cheriyamma / Kunjamma", "ചെറിയമ്മ") },
  bua: { ne: t("Phupu", "फुपू"), sd: t("Phui / Phuphi"), od: t("Pisi", "ପିଉସୀ"), asm: t("Pehi", "পেহী"), kn: t("Atte", "ಅತ್ತೆ"), ml: t("Ammayi / Appachi", "അമ്മായി") },
  phupha: { ne: t("Phupaju", "फुपाजु"), sd: t("Phupho"), od: t("Pisa", "ପିଉସା"), asm: t("Peha", "পেহা"), kn: t("Maava", "ಮಾವ"), ml: tnote("Maaman", "മാമൻ", "varies") },

  mama: { ne: t("Mama", "मामा"), sd: t("Maamo", "ماما"), od: t("Mamu", "ମାମୁଁ"), asm: t("Mama / Momai", "মামা"), kn: tnote("Maava", "ಮಾವ", "sodara maava"), ml: t("Ammavan / Maaman", "അമ്മാവൻ") },
  mami: { ne: t("Maiju", "माइजु"), sd: t("Maami", "مامي"), od: t("Maee / Mami", "ମାଈ"), asm: t("Mami", "মামী"), kn: t("Atte", "ಅತ್ತೆ"), ml: t("Ammayi", "അമ്മായി") },
  "mausi-e": { ne: t("Thuli Aama", "ठुली आमा"), sd: t("Maasi", "ماسي"), od: t("Bada Maa / Mausi", "ବଡ଼ ମା"), asm: t("Jethai / Apa", "জেঠাই"), kn: t("Doddamma", "ದೊಡ್ಡಮ್ಮ"), ml: t("Valyamma", "വല്യമ്മ") },
  "mausa-e": { ne: t("Thulobuwa", "ठुलोबुबा"), sd: t("Maaso"), od: t("Mausa", "ମାଉସା"), asm: t("Jetha / Nisa", "নিচা"), kn: t("Doddappa", "ದೊಡ್ಡಪ್ಪ"), ml: t("Valyachan", "വല്യച്ഛൻ") },
  "mausi-y": { ne: t("Sani Aama", "सानी आमा"), sd: t("Maasi", "ماسي"), od: t("Mausi", "ମାଉସୀ"), asm: t("Mahi", "মাহী"), kn: t("Chikkamma", "ಚಿಕ್ಕಮ್ಮ"), ml: t("Kunjamma / Cheriyamma", "കുഞ്ഞമ്മ") },
  "mausa-y": { ne: t("Sano Buwa", "सानो बुबा"), sd: t("Maaso"), od: t("Mausa", "ମାଉସା"), asm: t("Moha / Maha", "মহা"), kn: t("Chikkappa", "ಚಿಕ್ಕಪ್ಪ"), ml: t("Cheriyachan", "ചെറിയച്ഛൻ") },

  bbro: { ne: t("Dai / Daju", "दाइ"), sd: t("Ado / Vaḍo Bhau", "وڏو ڀاء"), od: t("Bhai / Nana", "ଭାଇ"), asm: t("Kokai / Dada", "ককাই"), kn: t("Anna", "ಅಣ್ಣ"), ml: t("Chettan", "ചേട്ടൻ") },
  ybro: { ne: t("Bhai", "भाइ"), sd: t("Nanḍho Bhau", "ننڍو ڀاء"), od: t("Bhai", "ଭାଇ"), asm: t("Bhai", "ভাই"), kn: t("Tamma", "ತಮ್ಮ"), ml: t("Aniyan", "അനിയൻ") },
  bsis: { ne: t("Didi", "दिदी"), sd: t("Vaḍi Bhiṇ", "وڏي ڀيڻ"), od: t("Apa / Bhauni", "ଆପା"), asm: t("Baideu", "বাইদেউ"), kn: t("Akka", "ಅಕ್ಕ"), ml: t("Chechi", "ചേച്ചി") },
  ysis: { ne: t("Bahini", "बहिनी"), sd: t("Nanḍhi Bhiṇ", "ننڍي ڀيڻ"), od: t("Bhauni", "ଭଉଣୀ"), asm: t("Bhoni", "ভনী"), kn: t("Tangi", "ತಂಗಿ"), ml: t("Aniyathi", "അനിയത്തി") },

  bhabhi: { ne: t("Bhauju", "भाउजू"), sd: t("Bhabhi", "ڀاڀي"), od: t("Bhauja", "ଭାଉଜ"), asm: t("Bou / Boidew", "বৌ"), kn: t("Attige", "ಅತ್ತಿಗೆ"), ml: t("Chettathi", "ചേട്ടത്തി") },
  jija: { ne: t("Bhinaju", "भिनाजु"), od: t("Bhinoi", "ଭିଣୋଇ"), asm: t("Bhinihi", "ভিনিহি"), kn: t("Bhaava", "ಭಾವ"), ml: t("Aliyan", "അളിയൻ") },

  husband: { ne: t("Shriman / Logne", "श्रीमान्"), sd: t("Maṛas", "مڙس"), od: t("Swami", "ସ୍ୱାମୀ"), asm: t("Swami / Ghaiti", "স্বামী"), kn: t("Ganda", "ಗಂಡ"), ml: t("Bharttavu", "ഭർത്താവ്") },
  wife: { ne: t("Shrimati / Swasni", "श्रीमती"), sd: t("Zaal", "زال"), od: t("Stri / Maiki", "ସ୍ତ୍ରୀ"), asm: t("Potni / Tirota", "পত্নী"), kn: t("Hendathi", "ಹೆಂಡತಿ"), ml: t("Bharya", "ഭാര്യ") },
  sasur: { ne: t("Sasura", "ससुरा"), sd: t("Sasur", "سسر"), od: t("Sasura", "ଶ୍ୱଶୁର"), asm: t("Xohur", "শ্বহুৰ"), kn: t("Maava", "ಮಾವ"), ml: t("Ammavan", "അമ്മാവൻ") },
  saas: { ne: t("Sasu", "सासू"), sd: t("Sas", "سس"), od: t("Sasu", "ଶାଶୂ"), asm: t("Xahu", "শাহু"), kn: t("Atte", "ಅತ್ತೆ"), ml: t("Ammayi", "അമ്മായി") },
  jeth: { ne: t("Jethaju", "जेठाजु"), sd: t("Jeṭho", "جيٺو"), od: t("Bhasura", "ଭାସୁର") },
  devar: { ne: t("Dewar", "देवर"), sd: t("Dair"), od: t("Debara", "ଦେବର"), asm: t("Deor", "দেওৰ"), kn: t("Maiduna", "ಮೈದುನ") },
  nanad: { ne: t("Nanda", "ननदा"), sd: t("Nanaṇ"), od: t("Nanada", "ନନନ୍ଦ"), asm: t("Nanand", "ননন্দ"), kn: t("Nadini", "ನಾದಿನಿ") },
  sala: { ne: t("Sala", "साला"), sd: t("Saalo", "سالو"), od: t("Sala", "ଶାଳା"), asm: t("Xala / Khulxali", "শালা"), kn: t("Bhamaida", "ಭಾವ") },
  sali: { ne: t("Sali", "साली"), sd: t("Saali", "سالي"), od: t("Sali", "ଶାଳୀ"), asm: t("Xali", "শালী") },

  son: { ne: t("Chora", "छोरा"), sd: t("Puṭ", "پُٽ"), od: t("Pua", "ପୁଅ"), asm: t("Lora / Putra", "ল'ৰা"), kn: t("Maga", "ಮಗ"), ml: t("Makan", "മകൻ") },
  daughter: { ne: t("Chori", "छोरी"), sd: t("Dhi", "ڌيءَ"), od: t("Jhia", "ଝିଅ"), asm: t("Suwali / Ji", "ছোৱালী"), kn: t("Magalu", "ಮಗಳು"), ml: t("Makal", "മകൾ") },
  bahu: { ne: t("Buhari", "बुहारी"), sd: t("Nĩnha"), od: t("Bohu", "ବୋହୂ"), asm: t("Buwari", "বোৱাৰী"), kn: t("Sose", "ಸೊಸೆ"), ml: t("Marumakal", "മരുമകൾ") },
  damad: { ne: t("Jwai", "ज्वाइँ"), od: t("Jwain", "ଜୁଆଇଁ"), asm: t("Juwai", "জোঁৱাই"), kn: t("Aliya", "ಅಳಿಯ"), ml: t("Marumakan", "മരുമകൻ") },

  bhatija: { ne: t("Bhatij / Chora", "भतिज"), sd: t("Bhaiṭyo", "ڀائٽيو"), od: t("Bhatija / Pua", "ଭତିଜା"), asm: t("Bhotija", "ভতিজা"), kn: t("by name"), ml: t("by name") },
  bhatiji: { ne: t("Bhatiji", "भतिजी"), sd: t("Bhaṇeji", "ڀاڻيجي"), od: t("Bhatijhi", "ଭତିଝି"), asm: t("Bhotiji", "ভতিজী"), kn: t("by name"), ml: t("by name") },
  bhanja: { ne: t("Bhanja", "भान्जा"), sd: t("Bhaṇejo"), od: t("Bhanja", "ଭଣଜ"), asm: t("Bhagin", "ভাগিন"), kn: tnote("Aliya", "ಅಳಿಯ", X), ml: t("Marumakan", "മരുമകൻ") },
  bhanji: { ne: t("Bhanji", "भान्जी"), sd: t("Bhaṇeji", "ڀاڻيجي"), od: t("Bhanji", "ଭଣଜୀ"), asm: t("Bhagini", "ভাগিনী"), kn: tnote("Sose", "ಸೊಸೆ", X), ml: t("Marumakal", "മരുമകൾ") },

  pota: { ne: t("Nati", "नाति"), sd: t("Poṭo", "پوٽو"), od: t("Nati", "ନାତି"), asm: t("Nati", "নাতি"), kn: t("Mommaga", "ಮೊಮ್ಮಗ"), ml: t("Cherumakan", "ചെറുമകൻ") },
  poti: { ne: t("Natini", "नातिनी"), sd: t("Poṭi", "پوٽي"), od: t("Natuni", "ନାତୁଣୀ"), asm: t("Natini", "নাতিনী"), kn: t("Mommagalu", "ಮೊಮ್ಮಗಳು"), ml: t("Cherumakal", "ചെറുമകൾ") },
  nawasa: { ne: t("Nati", "नाति"), sd: t("Ḍohitro"), od: t("Nati", "ନାତି"), asm: t("Nati", "নাতি"), kn: t("Mommaga", "ಮೊಮ್ಮಗ"), ml: t("Cherumakan", "ചെറുമകൻ") },
  nawasi: { ne: t("Natini", "नातिनी"), sd: t("Ḍohitri"), od: t("Natuni", "ନାତୁଣୀ"), asm: t("Natini", "নাতিনী"), kn: t("Mommagalu", "ಮೊಮ್ಮಗಳು"), ml: t("Cherumakal", "ചെറുമകൾ") },

  fbs: { ne: tnote("Dai / Bhai", "दाइ", "= brother"), od: tnote("Bhai", "ଭାଇ", "= brother"), asm: tnote("Kokai / Bhai", "ককাই", "= brother"), kn: tnote("Anna / Tamma", "ಅಣ್ಣ", "= brother"), ml: tnote("Chettan / Aniyan", "ചേട്ടൻ", "= brother") },
  fbd: { ne: tnote("Didi / Bahini", "दिदी", "= sister"), od: tnote("Bhauni", "ଭଉଣୀ", "= sister"), asm: tnote("Baideu / Bhoni", "বাইদেউ", "= sister"), kn: tnote("Akka / Tangi", "ಅಕ್ಕ", "= sister"), ml: tnote("Chechi / Aniyathi", "ചേച്ചി", "= sister") },
  mss: { ne: tnote("Mawali Dai / Bhai", "", "= brother"), kn: tnote("Anna / Tamma", "ಅಣ್ಣ", "= brother"), ml: tnote("Chettan / Aniyan", "ചേട്ടൻ", "= brother") },
  msd: { ne: tnote("Mawali Didi / Bahini", "", "= sister"), kn: tnote("Akka / Tangi", "ಅಕ್ಕ", "= sister"), ml: tnote("Chechi / Aniyathi", "ചേച്ചി", "= sister") },
  fzs: { ne: tnote("Phupuko chora", "", "cousin"), kn: tnote("Bhaava", "ಭಾವ", X), ml: tnote("Aliyan / Murappayyan", "അളിയൻ", X) },
  fzd: { kn: tnote("Attige / Nadini", "ಅತ್ತಿಗೆ", X), ml: tnote("Murappennu", "മുറപ്പെണ്ണ്", X) },
  mbs: { ne: tnote("Mama ko chora", "", "cousin"), kn: tnote("Bhaava", "ಭಾವ", X), ml: tnote("Aliyan / Murappayyan", "അളിയൻ", X) },
  mbd: { kn: tnote("Attige / Nadini", "ಅತ್ತಿಗೆ", X), ml: tnote("Murappennu", "മുറപ്പെണ്ണ്", X) },
};
Object.keys(EXTRA).forEach((id) => {
  const r = REL.find((x) => x.id === id);
  if (r) Object.assign(r.terms, EXTRA[id]);
});

/* Bengali as two co-equal registers, merged like EXTRA.
 * bnbd Bengali (Bangladesh) — Perso-Arabic / Muslim usage, listed first
 * bnwb Bengali (West Bengal) — Sanskritic / Hindu usage
 * Both written in the same Bengali script; they share most words and
 * diverge mainly for elders, aunts/uncles, and cousins. */
const BENGALI = {
  father: { bnbd: t("Abba / Baba", "আব্বা"), bnwb: t("Baba", "বাবা") },
  mother: { bnbd: t("Amma / Maa", "আম্মা"), bnwb: t("Maa", "মা") },
  dada: { bnbd: t("Dada", "দাদা"), bnwb: t("Thakurda / Dadu", "ঠাকুরদা") },
  dadi: { bnbd: t("Dadi", "দাদি"), bnwb: t("Thakuma", "ঠাকুমা") },
  nana: { bnbd: t("Nana", "নানা"), bnwb: t("Dadu", "দাদু") },
  nani: { bnbd: t("Nani / Nanu", "নানি"), bnwb: t("Didima / Dida", "দিদিমা") },
  taya: { bnbd: t("Boro Chacha", "বড় চাচা"), bnwb: t("Jyetha", "জ্যাঠা") },
  tai: { bnbd: t("Boro Chachi", "বড় চাচি"), bnwb: t("Jyethima", "জ্যেঠিমা") },
  chacha: { bnbd: t("Chacha", "চাচা"), bnwb: t("Kaka", "কাকা") },
  chachi: { bnbd: t("Chachi", "চাচি"), bnwb: t("Kakima", "কাকিমা") },
  bua: { bnbd: t("Phupu / Fupu", "ফুপু"), bnwb: t("Pishi", "পিসি") },
  phupha: { bnbd: t("Phupha / Fupa", "ফুপা"), bnwb: t("Pishemoshai", "পিসেমশাই") },
  mama: { bnbd: t("Mama", "মামা"), bnwb: t("Mama", "মামা") },
  mami: { bnbd: t("Mami", "মামি"), bnwb: t("Mami", "মামি") },
  "mausi-e": { bnbd: t("Boro Khala", "বড় খালা"), bnwb: t("Boro Mashi", "বড় মাসি") },
  "mausa-e": { bnbd: t("Khalu", "খালু"), bnwb: t("Meso", "মেসো") },
  "mausi-y": { bnbd: t("Khala", "খালা"), bnwb: t("Mashi", "মাসি") },
  "mausa-y": { bnbd: t("Khalu", "খালু"), bnwb: t("Meso", "মেসো") },
  bbro: { bnbd: t("Bhaiya / Boro Bhai", "ভাইয়া"), bnwb: t("Dada", "দাদা") },
  ybro: { bnbd: t("Choto Bhai", "ছোট ভাই"), bnwb: t("Bhai", "ভাই") },
  bsis: { bnbd: t("Apa / Boro Bon", "আপা"), bnwb: t("Didi", "দিদি") },
  ysis: { bnbd: t("Choto Bon", "ছোট বোন"), bnwb: t("Bon", "বোন") },
  bhabhi: { bnbd: t("Bhabi", "ভাবি"), bnwb: t("Boudi", "বৌদি") },
  jija: { bnbd: t("Dulabhai", "দুলাভাই"), bnwb: t("Jamaibabu", "জামাইবাবু") },
  husband: { bnbd: t("Shami", "স্বামী"), bnwb: t("Swami / Bor", "স্বামী") },
  wife: { bnbd: t("Stri / Bou", "স্ত্রী"), bnwb: t("Stri / Bou", "স্ত্রী") },
  sasur: { bnbd: t("Shoshur", "শ্বশুর"), bnwb: t("Shoshur", "শ্বশুর") },
  saas: { bnbd: t("Shashuri", "শাশুড়ি"), bnwb: t("Shashuri", "শাশুড়ি") },
  jeth: { bnbd: t("Bhashur", "ভাসুর"), bnwb: t("Bhashur", "ভাসুর") },
  devar: { bnbd: t("Debor", "দেবর"), bnwb: t("Debor", "দেবর") },
  nanad: { bnbd: t("Nonod", "ননদ"), bnwb: t("Nonod", "ননদ") },
  sala: { bnbd: t("Shala", "শালা"), bnwb: t("Shyalok", "শ্যালক") },
  sali: { bnbd: t("Shali", "শালী"), bnwb: t("Shyalika", "শ্যালিকা") },
  son: { bnbd: t("Chhele", "ছেলে"), bnwb: t("Chhele", "ছেলে") },
  daughter: { bnbd: t("Meye", "মেয়ে"), bnwb: t("Meye", "মেয়ে") },
  bahu: { bnbd: t("Bou / Putrobodhu", "বউ"), bnwb: t("Bouma", "বৌমা") },
  damad: { bnbd: t("Jamai", "জামাই"), bnwb: t("Jamai", "জামাই") },
  bhatija: { bnbd: t("Bhatija", "ভাতিজা"), bnwb: t("Bhaipo", "ভাইপো") },
  bhatiji: { bnbd: t("Bhatiji", "ভাতিজি"), bnwb: t("Bhaijhi", "ভাইঝি") },
  bhanja: { bnbd: t("Bhagina", "ভাগিনা"), bnwb: t("Bhagne", "ভাগ্নে") },
  bhanji: { bnbd: t("Bhagni", "ভাগ্নি"), bnwb: t("Bhagni", "ভাগ্নি") },
  pota: { bnbd: t("Nati", "নাতি"), bnwb: t("Nati", "নাতি") },
  poti: { bnbd: t("Natni", "নাতনি"), bnwb: t("Natni", "নাতনি") },
  nawasa: { bnbd: t("Nati", "নাতি"), bnwb: t("Nati", "নাতি") },
  nawasi: { bnbd: t("Natni", "নাতনি"), bnwb: t("Natni", "নাতনি") },
  fbs: { bnbd: t("Chachato Bhai", "চাচাতো ভাই"), bnwb: t("Jyethtuto Dada", "জ্যাঠতুতো") },
  fbd: { bnbd: t("Chachato Bon", "চাচাতো বোন"), bnwb: t("Jyethtuto Bon", "জ্যাঠতুতো") },
  mss: { bnbd: t("Khalato Bhai", "খালাতো ভাই"), bnwb: t("Mastuto Dada", "মাসতুতো") },
  msd: { bnbd: t("Khalato Bon", "খালাতো বোন"), bnwb: t("Mastuto Bon", "মাসতুতো") },
  fzs: { bnbd: t("Phuphato Bhai", "ফুপাতো ভাই"), bnwb: t("Pistuto Dada", "পিসতুতো") },
  fzd: { bnbd: t("Phuphato Bon", "ফুপাতো বোন"), bnwb: t("Pistuto Bon", "পিসতুতো") },
  mbs: { bnbd: t("Mamato Bhai", "মামাতো ভাই"), bnwb: t("Mamato Dada", "মামাতো") },
  mbd: { bnbd: t("Mamato Bon", "মামাতো বোন"), bnwb: t("Mamato Bon", "মামাতো") },
};
Object.keys(BENGALI).forEach((id) => {
  const r = REL.find((x) => x.id === id);
  if (r) Object.assign(r.terms, BENGALI[id]);
});

/* Sylheti — Sylhet-region Eastern Indo-Aryan (Muslim register, the diaspora-
 * dominant form). No standardized orthography, so shown romanized only.
 * Note the Sylheti fricative shift: ch → s (Chacha → Sasa, Chachi → Sasi),
 * and boro / huru = big / small. A Hindu Sylheti register tracks closer to
 * standard West-Bengal Bengali. */
const SYLHETI = {
  father: t("Abba / Baba"), mother: t("Amma / Ma"),
  dada: t("Dada"), dadi: t("Dadi"), nana: t("Nana"), nani: t("Nani"),
  taya: t("Boro Sasa"), tai: t("Boro Sasi"), chacha: t("Sasa"), chachi: t("Sasi"),
  bua: t("Fufu"), phupha: t("Fufa"),
  mama: t("Mama / Mamu"), mami: t("Mami"),
  "mausi-e": t("Boro Khala"), "mausa-e": t("Khalu"), "mausi-y": t("Khala / Moi"), "mausa-y": t("Khalu"),
  bbro: t("Bhaisaab / Bhai"), ybro: t("Huru Bhai"), bsis: t("Buai / Apa"), ysis: t("Huru Boin"),
  bhabhi: t("Bhabi"), jija: t("Dulabhai"),
  husband: t("Zamai"), wife: t("Bow"),
  son: t("Fut / Putr"), daughter: t("Zi"),
  pota: t("Nati"), poti: t("Natni"), nawasa: t("Nati"), nawasi: t("Natni"),
  fbs: t("Sasato Bhai"), fbd: t("Sasato Boin"), mss: t("Khalato Bhai"), msd: t("Khalato Boin"),
  fzs: t("Fufato Bhai"), fzd: t("Fufato Boin"), mbs: t("Mamato Bhai"), mbd: t("Mamato Boin"),
};
Object.keys(SYLHETI).forEach((id) => {
  const r = REL.find((x) => x.id === id);
  if (r) Object.assign(r.terms, { syl: SYLHETI[id] });
});

/* Third and fourth families + more Indo-Aryan, merged like the earlier layers.
 * paPk Punjabi (Pakistan) · skr Saraiki · rhg Rohingya · ctg Chittagonian  (Indo-Aryan)
 * ks  Kashmiri  (Dardic — its own native system)
 * ps  Pashto · bal Balochi · dari Dari  (Iranian — a third family)
 * Romanized primary; native script given for Pashto and Dari. Balochi is the
 * most sparsely documented; a few Balochi cells are reconstructed from related
 * Iranian forms and several are left "—". */
const NEWBATCH = {
  father: { paPk: t("Abba / Pyo"), skr: t("Abba / Pyo"), rhg: t("Baa / Abba"), ctg: t("Baba / Abba"), ks: t("Mol / Bab"), ps: t("Plaar", "پلار"), bal: t("Pit / Pis"), dari: t("Padar / Baba", "پدر") },
  mother: { paPk: t("Amma / Maa"), skr: t("Amma / Maa"), rhg: t("Maa / Maaji"), ctg: t("Maa / Amma"), ks: t("Mouj"), ps: t("Mor", "مور"), bal: t("Mat / Mas"), dari: t("Madar / Maadar", "مادر") },

  dada: { paPk: t("Dada"), skr: t("Dada"), rhg: t("Dobaa"), ctg: t("Dada"), ps: t("Nikə", "نیکه"), dari: t("Baba Kalan", "بابا کلان") },
  dadi: { paPk: t("Dadi"), skr: t("Dadi"), rhg: t("Domaa"), ctg: t("Dadi"), ps: t("Nia", "نیا"), dari: t("Bibi Kalan", "بی‌بی") },
  nana: { paPk: t("Nana"), skr: t("Nana"), rhg: t("Nanaa"), ctg: t("Nana"), ps: t("Nikə", "نیکه"), dari: t("Nika / Baba", "نیکه") },
  nani: { paPk: t("Nani"), skr: t("Nani"), rhg: t("Nanii"), ctg: t("Nani"), ps: t("Nia", "نیا"), dari: t("Bibi", "بی‌بی") },

  taya: { paPk: t("Taya"), skr: t("Bara Abba / Taya"), rhg: t("Jera / Jetta"), ctg: t("Bara Baf / Jeţa"), ps: t("Tre", "تره"), dari: t("Kaka", "کاکا") },
  tai: { paPk: t("Tai"), skr: t("Tai") },
  chacha: { paPk: t("Chacha"), skr: t("Chacha"), rhg: t("Sańsa / Kakku"), ctg: t("Sasa / Kaka"), ps: t("Tre", "تره"), dari: t("Kaka", "کاکا") },
  chachi: { paPk: t("Chachi"), skr: t("Chachi"), ctg: t("Sasi / Kaki") },
  bua: { paPk: t("Phupho / Bhua"), skr: t("Phuphi / Bhua"), rhg: t("Fufi / Fuńja"), ctg: t("Fufu"), ks: t("Poph"), ps: t("Tror", "ترور"), dari: t("Ama", "عمه") },
  phupha: { paPk: t("Phupha"), skr: t("Phupha") },

  mama: { paPk: t("Mama"), skr: t("Mama"), rhg: t("Mamu"), ctg: t("Mamu"), ks: t("Maam"), ps: t("Maama", "ماما"), dari: t("Mama", "ماما") },
  mami: { paPk: t("Mami"), skr: t("Mami"), ctg: t("Mami") },
  "mausi-e": { paPk: t("Bari Khala"), skr: t("Bari Khala"), rhg: t("Mui / Khala"), ctg: t("Bara Hala"), ks: t("Mass"), ps: t("Khala", "خاله"), dari: t("Khala", "خاله") },
  "mausa-e": { paPk: t("Khalu"), skr: t("Khalu"), rhg: t("Khalu"), ctg: t("Halu") },
  "mausi-y": { paPk: t("Khala"), skr: t("Khala"), rhg: t("Mui / Khala"), ctg: t("Hala"), ks: t("Mass"), ps: t("Khala", "خاله"), dari: t("Khala", "خاله") },
  "mausa-y": { paPk: t("Khalu"), skr: t("Khalu"), rhg: t("Khalu"), ctg: t("Halu") },

  bbro: { paPk: t("Vadda Bhra"), skr: t("Adda / Bha"), rhg: t("Bodda / Bai"), ctg: t("Bara Bai"), ks: t("Boi"), ps: t("Wror", "ورور"), bal: t("Braat"), dari: t("Baradar", "برادر") },
  ybro: { paPk: t("Nikka Bhra"), skr: t("Nikka Bha"), rhg: t("Gura Bai"), ctg: t("Sru Bai"), ks: t("Boi"), ps: t("Wror", "ورور"), bal: t("Braat"), dari: t("Baradar", "برادر") },
  bsis: { paPk: t("Vaddi Bhain"), skr: t("Addi / Bhain"), rhg: t("Bubu / Dobu"), ctg: t("Bara Boin"), ks: t("Beni"), ps: t("Khor", "خور"), bal: t("Gohaar"), dari: t("Khahar", "خواهر") },
  ysis: { paPk: t("Nikki Bhain"), skr: t("Nikki Bhain"), rhg: t("Gura Buu"), ctg: t("Sru Boin"), ks: t("Beni"), ps: t("Khor", "خور"), bal: t("Gohaar"), dari: t("Khahar", "خواهر") },

  bhabhi: { paPk: t("Bharjai"), skr: t("Bharjai"), rhg: t("Bóuzi"), ctg: t("Bóuji") },
  jija: { paPk: t("Behnoi"), skr: t("Behnoi") },

  husband: { paPk: t("Khasam / Shauhar"), skr: t("Khasam"), ks: t("Run"), ps: t("Khawand / Mēṛə", "خاوند"), dari: t("Shohar", "شوهر") },
  wife: { paPk: t("Vohti / Zal"), skr: t("Wohti / Zal"), ks: t("Zanan"), ps: t("X̌edza", "ښځه"), dari: t("Zan / Khanum", "زن") },
  sasur: { paPk: t("Sohra"), skr: t("Sohra"), rhg: t("Hour"), ctg: t("Hour"), ks: t("Hihur"), ps: t("Skar", "سخر"), dari: t("Khusur", "خسر") },
  saas: { paPk: t("Sass"), skr: t("Sass"), rhg: t("Houri"), ctg: t("Houri"), ks: t("Hash"), ps: t("Khwakhe", "خواښې"), dari: t("Khoshu", "خوشو") },
  jeth: { paPk: t("Jeth"), skr: t("Jeth"), rhg: t("Bahcur") },
  devar: { paPk: t("Dyor"), skr: t("Dewar"), rhg: t("Dior"), ctg: t("Dewor") },
  nanad: { paPk: t("Nanaan"), skr: t("Nanaan"), rhg: t("Nanond"), ctg: t("Nonod") },
  sala: { paPk: t("Sala"), skr: t("Sala"), rhg: t("Hońdi / Hala"), ctg: t("Hala") },
  sali: { paPk: t("Sali"), skr: t("Sali"), rhg: t("Hali"), ctg: t("Hali") },

  son: { paPk: t("Puttar"), skr: t("Putr / Chohar"), rhg: t("Futr / Fua"), ctg: t("Foa / Futr"), ks: t("Nechuv"), ps: t("Zoy", "زوی"), bal: t("Bachek"), dari: t("Pesar / Bacha", "پسر") },
  daughter: { paPk: t("Dhi"), skr: t("Dhi"), rhg: t("Maiya / Zíi"), ctg: t("Maiya"), ks: t("Kuur"), ps: t("Loor", "لور"), bal: t("Jinik"), dari: t("Dukhtar", "دختر") },
  bahu: { paPk: t("Nuunh"), skr: t("Nuunh"), dari: t("Arus / Sunu", "عروس") },
  damad: { paPk: t("Jawai"), skr: t("Jawai"), rhg: t("Taloi"), dari: t("Damad", "داماد") },

  bhatija: { paPk: t("Bhatija"), skr: t("Bhatija"), ps: t("Wrara", "وراره"), dari: t("Baradar-zada", "برادرزاده") },
  bhatiji: { paPk: t("Bhatiji"), skr: t("Bhatiji"), dari: t("Baradar-zada", "برادرزاده") },
  bhanja: { paPk: t("Bhanja"), skr: t("Bhanja"), rhg: t("Bóinfut"), ctg: t("Boinfut"), ps: t("Khorzay", "خوریی"), dari: t("Khahar-zada", "خواهرزاده") },
  bhanji: { paPk: t("Bhanji"), skr: t("Bhanji"), dari: t("Khahar-zada", "خواهرزاده") },

  pota: { paPk: t("Pota"), skr: t("Pota"), ps: t("Lmasay", "لمسی"), dari: t("Nawasa", "نواسه") },
  poti: { paPk: t("Poti"), skr: t("Poti"), ps: t("Lmase", "لمسۍ"), dari: t("Nawasa", "نواسه") },
  nawasa: { paPk: t("Dohta"), skr: t("Dohta"), ps: t("Lmasay", "لمسی"), dari: t("Nawasa", "نواسه") },
  nawasi: { paPk: t("Dohti"), skr: t("Dohti"), ps: t("Lmase", "لمسۍ"), dari: t("Nawasa", "نواسه") },

  fbs: { paPk: t("Chachera Bhra"), skr: t("Chachera Bha"), rhg: t("Sańsato Bai"), ctg: t("Sasato Bai"), ks: tnote("Boi", "", "= brother"), dari: t("Pesar-kaka", "پسرکاکا") },
  fbd: { paPk: t("Chacheri Bhain"), skr: t("Chacheri Bhain"), rhg: t("Sańsato Buu"), ctg: t("Sasato Boin"), ks: tnote("Beni", "", "= sister"), dari: t("Dukhtar-kaka", "دخترکاکا") },
  mss: { paPk: t("Khalera Bhra"), skr: t("Khalera Bha"), rhg: t("Khalato Bai"), ctg: t("Halato Bai"), ks: tnote("Boi", "", "= brother"), dari: t("Pesar-khala", "پسرخاله") },
  msd: { paPk: t("Khaleri Bhain"), skr: t("Khaleri Bhain"), rhg: t("Khalato Buu"), ctg: t("Halato Boin"), ks: tnote("Beni", "", "= sister"), dari: t("Dukhtar-khala", "دخترخاله") },
  fzs: { paPk: t("Phuphera Bhra"), skr: t("Phuphera Bha"), rhg: t("Fufato Bai"), ctg: t("Fufato Bai"), ks: tnote("Boi", "", "= brother"), ps: tnote("Tarbur", "تربور", "also 'rival'"), dari: t("Pesar-ama", "پسرعمه") },
  fzd: { paPk: t("Phupheri Bhain"), skr: t("Phupheri Bhain"), rhg: t("Fufato Buu"), ctg: t("Fufato Boin"), ks: tnote("Beni", "", "= sister"), dari: t("Dukhtar-ama", "دخترعمه") },
  mbs: { paPk: t("Mamera Bhra"), skr: t("Mamera Bha"), rhg: t("Mamato Bai"), ctg: t("Mamato Bai"), ks: tnote("Boi", "", "= brother"), dari: t("Pesar-mama", "پسرماما") },
  mbd: { paPk: t("Mameri Bhain"), skr: t("Mameri Bhain"), rhg: t("Mamato Buu"), ctg: t("Mamato Boin"), ks: tnote("Beni", "", "= sister"), dari: t("Dukhtar-mama", "دخترماما") },
};
Object.keys(NEWBATCH).forEach((id) => {
  const r = REL.find((x) => x.id === id);
  if (r) Object.assign(r.terms, NEWBATCH[id]);
});

const CATS = [
  { id: "parents", title: "Parents" },
  { id: "grand", title: "Grandparents" },
  { id: "fside", title: "Father's siblings" },
  { id: "mside", title: "Mother's siblings" },
  { id: "sib", title: "Siblings" },
  { id: "sibsp", title: "Siblings' spouses" },
  { id: "partner", title: "Partner & in-laws" },
  { id: "child", title: "Children & their spouses" },
  { id: "niece", title: "Nephews & nieces" },
  { id: "grandchild", title: "Grandchildren" },
  { id: "cousin", title: "Cousins \u2014 cross vs parallel",
    intro: "South Asia's deepest split lives here. North Indian (Indo-Aryan) languages give every cousin a derived name. Dravidian languages divide them in two: parallel cousins (children of your father's brother or mother's sister) are your siblings, while cross cousins (children of your father's sister or mother's brother) are marriageable and named like in-laws." },
];

const PATHMAP = (() => {
  const m = {};
  REL.forEach((r) => r.paths.forEach((p) => { if (!m[p]) m[p] = r; }));
  return m;
})();

const STEPS = [
  { group: "Parents", items: [["father", "F"], ["mother", "M"]] },
  { group: "Siblings", items: [["elder brother", "Be"], ["younger brother", "By"], ["elder sister", "Ze"], ["younger sister", "Zy"]] },
  { group: "Partner", items: [["husband", "H"], ["wife", "W"]] },
  { group: "Children", items: [["son", "S"], ["daughter", "D"]] },
];

const EXAMPLES = [
  { label: "father's younger brother's wife", path: [["father", "F"], ["younger brother", "By"], ["wife", "W"]] },
  { label: "mother's brother", path: [["mother", "M"], ["elder brother", "Be"]] },
  { label: "father's sister", path: [["father", "F"], ["elder sister", "Ze"]] },
  { label: "mother's brother's daughter", path: [["mother", "M"], ["elder brother", "Be"], ["daughter", "D"]] },
  { label: "father's sister's son", path: [["father", "F"], ["elder sister", "Ze"], ["son", "S"]] },
  { label: "husband's younger brother", path: [["husband", "H"], ["younger brother", "By"]] },
];

function sideOf(paths) {
  const a = (paths[0] || "").split("-")[0];
  if (a === "F") return "Paternal line";
  if (a === "M") return "Maternal line";
  if (a === "H" || a === "W") return "By marriage";
  if (a === "Be" || a === "By" || a === "Ze" || a === "Zy") return "Your generation";
  if (a === "S" || a === "D") return "Descending";
  return "";
}
function structHtml(s) {
  return s.replace(/(cross cousin|parallel cousin|marriageable|son-in-law|mother-in-law|father-in-law)/gi, "<b>$1</b>");
}

// Which shown languages share a root token (>=2 of them)? Returns langId -> shared root.
function cognateMap(rel, langs) {
  const toks = {};
  langs.forEach((l) => {
    const tm = rel.terms[l.id];
    if (!tm || !tm.r || tm.r === "by name") return;
    toks[l.id] = tm.r.toLowerCase().split(/[\/\s]+/).map((x) => x.replace(/[^a-z]/g, "")).filter((x) => x.length >= 3);
  });
  const count = {};
  Object.values(toks).forEach((arr) => Array.from(new Set(arr)).forEach((tk) => { count[tk] = (count[tk] || 0) + 1; }));
  const out = {};
  Object.keys(toks).forEach((id) => { const hit = toks[id].find((tk) => count[tk] >= 2); if (hit) out[id] = hit; });
  return out;
}

function TermCard({ rel, langs, showNative }) {
  const cog = cognateMap(rel, langs);
  const hasCog = Object.keys(cog).length > 0;
  const showStruct = rel.struct && (rel.cat !== "cousin" || langs.some((l) => l.fam === "drav"));
  return (
    <div>
      <div className="kx-head">
        <div className="kx-word">{rel.label}</div>
        <div className="kx-tag">{sideOf(rel.paths)}</div>
      </div>
      {showStruct && (
        <div className="kx-struct">
          <span className="mk">&#8627;</span>
          <span dangerouslySetInnerHTML={{ __html: structHtml(rel.struct) }} />
        </div>
      )}
      {FAM_ORDER.map((fam) => {
        const ls = langs.filter((l) => l.fam === fam);
        if (!ls.length) return null;
        return (
          <div className="kx-fam" key={fam}>
            <div className="kx-famhd">
              <span className="kx-dot" style={{ background: FAM[fam].color }} />
              <h4 style={{ color: FAM[fam].color }}>{FAM[fam].name}</h4>
              <span className="ln" />
            </div>
            <div className="kx-rows">
              {ls.map((l) => {
                const term = rel.terms[l.id];
                if (!term) {
                  return (
                    <div className="kx-row" key={l.id}>
                      <div className="kx-lang">{l.name}</div>
                      <div className="kx-term"><div className="kx-roman kx-dash">—</div></div>
                    </div>
                  );
                }
                const isByName = term.r === "by name";
                const isX = term.note === X;
                const isSib = term.note === "= brother" || term.note === "= sister";
                const showNote = term.note && !isX && !isSib;
                return (
                  <div className="kx-row" key={l.id}>
                    <div className="kx-lang">{l.name}</div>
                    <div className="kx-term">
                      <div className={"kx-roman" + (cog[l.id] ? " kx-cognate" : "") + (isByName ? " kx-byname" : "")} title={isByName ? "no dedicated term — such relatives are simply addressed by name" : (cog[l.id] ? "shared root: " + cog[l.id] : undefined)}>
                        {isByName ? "(by name)" : term.r}
                        {isX && <span className="kx-mk">marriageable</span>}
                        {isSib && <span className="kx-mk sib">sibling</span>}
                      </div>
                      {showNative && term.n && <div className="kx-native">{term.n}</div>}
                      {showNote && <div className="kx-note">{term.note}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {hasCog && <div className="kx-cogcap">underlined = a root shared by two or more of the languages shown</div>}
    </div>
  );
}

/* ---------------- educational data ---------------- */
const MORPH = [
  { lang: "Tamil", fam: "drav", elder: "periya", younger: "chinna", fr: "appa", mr: "amma",
    ef: { r: "Periyappa", n: "பெரியப்பா" }, yf: { r: "Chithappa", n: "சித்தப்பா" }, em: { r: "Periyamma", n: "பெரியம்மா" }, ym: { r: "Chinnamma", n: "சின்னம்மா" } },
  { lang: "Kannada", fam: "drav", elder: "doDDa", younger: "chikka", fr: "appa", mr: "amma",
    ef: { r: "Doddappa", n: "ದೊಡ್ಡಪ್ಪ" }, yf: { r: "Chikkappa", n: "ಚಿಕ್ಕಪ್ಪ" }, em: { r: "Doddamma", n: "ದೊಡ್ಡಮ್ಮ" }, ym: { r: "Chikkamma", n: "ಚಿಕ್ಕಮ್ಮ" } },
  { lang: "Malayalam", fam: "drav", elder: "valiya", younger: "cheriya", fr: "achan", mr: "amma",
    ef: { r: "Valyachan", n: "വല്യച്ഛൻ" }, yf: { r: "Cheriyachan", n: "ചെറിയച്ഛൻ" }, em: { r: "Valyamma", n: "വല്യമ്മ" }, ym: { r: "Cheriyamma", n: "ചെറിയമ്മ" } },
  { lang: "Telugu", fam: "drav", elder: "pedda", younger: "chinna", fr: "nanna", mr: "amma",
    ef: { r: "Peddananna", n: "పెదనాన్న" }, yf: { r: "Chinnanna", n: "చిన్నాన్న" }, em: { r: "Peddamma", n: "పెద్దమ్మ" }, ym: { r: "Chinnamma", n: "చిన్నమ్మ" } },
  { lang: "Nepali", fam: "indo", elder: "thulo", younger: "sano", fr: "buwa", mr: "aama",
    ef: { r: "Thulobuwa", n: "ठुलोबुबा" }, yf: { r: "Sano Buwa", n: "सानो बुबा" }, em: { r: "Thuli Aama", n: "ठुली आमा" }, ym: { r: "Sani Aama", n: "सानी आमा" } },
  { lang: "Odia", fam: "indo", elder: "bada", younger: "sana", fr: "bapa", mr: "maa",
    ef: { r: "Bada Bapa", n: "ବଡ଼ବାପା" }, yf: { r: "Sana Bapa", n: "ଛୋଟ ବାପା" }, em: { r: "Bada Maa", n: "ବଡ଼ ମା" }, ym: { r: "Sana Maa", n: "ଛୋଟ ମା" } },
];
const MORPH_MEAN = { ef: "Father's elder brother", yf: "Father's younger brother", em: "Mother's elder sister", ym: "Mother's younger sister" };
const OPAQUE = [["Hindi", "Tau", "Chacha"], ["Urdu", "Taya", "Chacha"], ["Punjabi", "Taya", "Chacha"], ["Gujarati", "Mota Kaka", "Kaka"], ["Bengali", "Jyetha", "Kaka"], ["Marathi", "Kaka", "Kaka"]];
const GENDER = [["Chacha", "Chachi"], ["Mama", "Mami"], ["Nana", "Nani"], ["Dada", "Dadi"], ["Beta", "Beti"], ["Sala", "Sali"], ["Pota", "Poti"], ["Bhatija", "Bhatiji"], ["Bhanja", "Bhanji"], ["Jeth", "Jethani"]];
const COGNATES = [
  { root: "Mama", mean: "mother's brother", langs: "<b>Hindi, Punjabi, Gujarati, Marathi, Bengali, Nepali</b> say Mama; <b>Urdu</b> Mamu; <b>Sindhi</b> Maamo — even Dravidian <b>Kannada</b> Maava and <b>Malayalam</b> Maaman are relatives of it." },
  { root: "Nana · Nani", mean: "maternal grandparents", langs: "Shared across <b>Hindi, Urdu, Punjabi, Gujarati, Marathi, Sindhi</b>. Bengali swaps to Dadu / Didima; Tamil & Kannada to Thatha / Ajja." },
  { root: "Dada · Dadi", mean: "paternal grandparents", langs: "<b>Hindi, Urdu, Punjabi, Gujarati, Sindhi</b> share it. Marathi uses Ajoba / Aaji; the Dravidian languages use Ajja / Thatha." },
  { root: "Mas-", mean: "mother's sister", langs: "<b>Gujarati, Bengali, Sindhi, Odia</b> Masi; <b>Hindi</b> Mausi; <b>Marathi</b> Mavshi. (Urdu and Bangladeshi Bengali switch to Khala.)" },
  { root: "Kaka", mean: "father's brother", langs: "<b>Gujarati, Marathi, Bengali, Nepali, Odia, Sindhi</b> use Kaka(o) — usually the younger one. Hindi instead splits Tau vs Chacha." },
  { root: "Phuph- · Pish-", mean: "father's sister", langs: "<b>Hindi</b> Phuphi / Bua, <b>Punjabi</b> Bhua, <b>Nepali</b> Phupu, <b>Bengali</b> Pishi, <b>Gujarati</b> Foi — one old thread, many shapes." },
];

function WordBuilder() {
  const [li, setLi] = useState(0);
  const [age, setAge] = useState("e");
  const [root, setRoot] = useState("f");
  const m = MORPH[li];
  const key = age + root;
  const out = m[key];
  const pre = age === "e" ? m.elder : m.younger;
  const rootM = root === "f" ? m.fr : m.mr;
  return (
    <div className="kx-build">
      <div className="kx-bpick">
        <div className="kx-seg" role="group" aria-label="language">
          {MORPH.map((x, i) => (
            <button key={x.lang} className="kx-segb" data-on={i === li} onClick={() => setLi(i)}>{x.lang}</button>
          ))}
        </div>
      </div>
      <div className="kx-bpick">
        <div className="kx-seg">
          <button className="kx-segb" data-on={age === "e"} onClick={() => setAge("e")}>elder</button>
          <button className="kx-segb" data-on={age === "y"} onClick={() => setAge("y")}>younger</button>
        </div>
        <div className="kx-seg">
          <button className="kx-segb" data-on={root === "f"} onClick={() => setRoot("f")}>father-side</button>
          <button className="kx-segb" data-on={root === "m"} onClick={() => setRoot("m")}>mother-side</button>
        </div>
      </div>
      <div className="kx-formula">
        <div className={"kx-morph " + m.fam}>
          <span className="pre">{age === "e" ? "elder" : "younger"}</span>
          <span className="val">{pre}</span>
        </div>
        <span className="kx-plus">+</span>
        <div className={"kx-morph " + m.fam}>
          <span className="pre">{root === "f" ? "father" : "mother"}</span>
          <span className="val">{rootM}</span>
        </div>
        <span className="kx-eq">=</span>
        <div className="kx-out">
          <span className="pre">{MORPH_MEAN[key]}</span>
          <span className="val">{out.r}</span>
          <span className="nat">{out.n}</span>
        </div>
      </div>
      <div className="kx-note" style={{ textAlign: "center", marginTop: 4 }}>
        Everyday speech sometimes swaps in a stand-alone word for the younger uncle (Telugu <i>Babai</i>, Nepali <i>Kaka</i>), but big / small is the underlying logic.
      </div>
    </div>
  );
}

function PatternsView() {
  return (
    <div>
      <div className="kx-lesson">
        <div className="kx-lnum">Lesson 01 · why so many words</div>
        <div className="kx-lh">English keeps four facts hidden</div>
        <p className="kx-lp">
          One English word, <b>uncle</b>, blurs four things these languages keep separate. Learn
          to hear the four questions and the long lists stop feeling random: which <b>side</b>
          (father's or mother's), <b>seniority</b> (older or younger than your parent), <b>blood
          or marriage</b>, and — only in the south — <b>cross or parallel</b>.
        </p>
        <div className="kx-cog">
          <div className="kx-cogrow">
            <div className="kx-cogh"><span className="kx-cogroot">Hindi splits "uncle" four ways</span></div>
            <div className="kx-coglangs"><b>Tau</b> (father's elder bro) · <b>Chacha</b> (father's younger bro) · <b>Mama</b> (mother's bro) · <b>Phupha / Mausa</b> (an aunt's husband) — birth order and side, baked into the word.</div>
          </div>
          <div className="kx-cogrow">
            <div className="kx-cogh"><span className="kx-cogroot" style={{ color: "var(--drav)" }}>Tamil adds a fifth question</span></div>
            <div className="kx-coglangs"><b>Mama</b> isn't only mother's brother — he's also father-in-law, because his daughter is who you would marry. The cross / parallel line decides who is a sibling and who is a spouse.</div>
          </div>
        </div>
      </div>

      <div className="kx-lesson">
        <div className="kx-lnum">Lesson 02 · the big shortcut</div>
        <div className="kx-lh">Many words are just "big-father / small-father"</div>
        <p className="kx-lp">
          Here is the single most useful pattern. In a whole band of languages — across <b>both</b>
          families — the uncle / aunt words aren't memorized wholes. They're built: a size prefix
          (<b>big</b> = elder, <b>small</b> = younger) snapped onto <b>father</b> or <b>mother</b>.
          Learn two prefixes and two roots and you can generate four relatives. Try it:
        </p>
        <WordBuilder />
        <p className="kx-lp" style={{ marginTop: 14, marginBottom: 6 }}>
          The contrast: in the other half, the word is a single lump you simply have to learn — no
          "big" or "small" hiding inside.
        </p>
        <div className="kx-mtable">
          <div className="kx-mrow h"><span>Language</span><span>elder uncle</span><span>younger uncle</span><span>decomposable?</span></div>
          {OPAQUE.map((o) => (
            <div className="kx-mrow" key={o[0]}>
              <span className="kx-mlang">{o[0]}</span>
              <span className="kx-mword">{o[1]}</span>
              <span className="kx-mword">{o[2]}</span>
              <span className="kx-dash" style={{ fontSize: 12 }}>no — memorize</span>
            </div>
          ))}
        </div>
      </div>

      <div className="kx-lesson">
        <div className="kx-lnum">Lesson 03 · the vowel flip</div>
        <div className="kx-lh">Learn the man, flip to the woman</div>
        <p className="kx-lp">
          A second shortcut for the northern languages: most male / female pairs differ by one
          vowel — masculine <b>-a</b> becomes feminine <b>-i</b>. Get the male term and the female
          usually falls out for free.
        </p>
        <div className="kx-pairs">
          {GENDER.map((g) => (
            <div className="kx-pair" key={g[0]}>
              <span className="kx-pm">{g[0]}</span>
              <span className="kx-parrow">→</span>
              <span className="kx-pf">{g[1]}</span>
            </div>
          ))}
        </div>
        <p className="kx-lp" style={{ marginTop: 12, marginBottom: 0 }}>
          The Dravidian echo of this is <b>-appa</b> (father) vs <b>-amma</b> (mother): Periy<b>appa</b> / Periy<b>amma</b>, Dodd<b>appa</b> / Dodd<b>amma</b>.
        </p>
      </div>

      <div className="kx-lesson">
        <div className="kx-lnum">Lesson 04 · words that travel</div>
        <div className="kx-lh">You already know more than you think</div>
        <p className="kx-lp">
          A handful of roots are nearly pan–South Asian. Lock these in once and they carry across
          six or seven languages — a few even leak across the Indo-Aryan / Dravidian border.
        </p>
        <div className="kx-cog">
          {COGNATES.map((c) => (
            <div className="kx-cogrow" key={c.root}>
              <div className="kx-cogh">
                <span className="kx-cogroot">{c.root}</span>
                <span className="kx-cogmean">{c.mean}</span>
              </div>
              <div className="kx-coglangs" dangerouslySetInnerHTML={{ __html: c.langs }} />
            </div>
          ))}
        </div>
      </div>

      <div className="kx-lesson">
        <div className="kx-lnum">Lesson 05 · cross vs parallel</div>
        <div className="kx-lh">The line that turns a cousin into a spouse</div>
        <p className="kx-lp">
          The Dravidian rule worth memorizing: line up your parent's siblings by gender.
          <b> Same-gender</b> siblings (father's brother, mother's sister) give you <b>parallel</b>
          cousins — counted as your own brothers and sisters, off-limits. <b>Opposite-gender</b>
          siblings (father's sister, mother's brother) give you <b>cross</b> cousins —
          traditionally the people you marry, so they take in-law names (Tamil <i>Attan / Machaan</i>,
          Telugu <i>Bava</i>, Kannada <i>Bhaava</i>).
        </p>
        <div className="kx-cog">
          <div className="kx-cogrow">
            <div className="kx-cogh"><span className="kx-cogroot">Parallel = sibling</span><span className="kx-cogmean">father's-brother's & mother's-sister's kids</span></div>
            <div className="kx-coglangs">Called exactly like your own brother / sister — Annan, Thambi, Akka, Thangai. Marriage forbidden.</div>
          </div>
          <div className="kx-cogrow">
            <div className="kx-cogh"><span className="kx-cogroot" style={{ color: "var(--drav)" }}>Cross = marriageable</span><span className="kx-cogmean">father's-sister's & mother's-brother's kids</span></div>
            <div className="kx-coglangs">Named like a brother-in-law / bride-to-be. This is why "Mama" doubles as father-in-law and "Athai" as mother-in-law.</div>
          </div>
        </div>
        <p className="kx-lp" style={{ marginTop: 12, marginBottom: 0 }}>
          The northern languages don't draw this line — every cousin just takes the uncle / aunt
          root plus a cousin ending (Chacha → <i>Chachera bhai</i>, Mama → <i>Mamera bhai</i>).
        </p>
      </div>

      <div className="kx-lesson">
        <div className="kx-lnum">Lesson 06 · borrowed words</div>
        <div className="kx-lh">The Perso-Arabic layer</div>
        <p className="kx-lp">
          For centuries Persian was the court and literary language across much of South Asia, and
          Islamic cultural contact carried Arabic vocabulary with it. Muslim communities took on a
          stratum of <b>Perso-Arabic kinship words</b> that sits on top of — or replaces — the older
          forms. It's exactly why this tool gives Bengali two columns, and why Urdu, Bangladeshi and
          Sylheti Bengali, Sindhi, and Pakistani Punjabi all share a familiar set. The swaps cluster
          on the same handful of relatives:
        </p>
        <div className="kx-mtable">
          <div className="kx-mrow h"><span>Relative</span><span>Hindu / standard</span><span>Muslim register</span><span>origin of the loan</span></div>
          {[["Mother's sister", "Mashi · Mausi", "Khala", "Arabic khāla"],
            ["Her husband", "Meso · Mausa", "Khalu", "from khāla"],
            ["Father", "Baba · Pita", "Abba", "Arabic ab"],
            ["Mother", "Maa", "Amma · Ammi", "Arabic umm"],
            ["Son-in-law", "Jamai", "Damad", "Persian dāmād"],
            ["Husband", "Bor · Pati", "Shauhar", "Persian shōhar"]].map((r) => (
            <div className="kx-mrow" key={r[0]}>
              <span className="kx-mlang">{r[0]}</span>
              <span className="kx-mword">{r[1]}</span>
              <span className="kx-mword" style={{ color: "var(--indo)" }}>{r[2]}</span>
              <span className="kx-dash" style={{ fontSize: 12, fontStyle: "normal" }}>{r[3]}</span>
            </div>
          ))}
        </div>
        <p className="kx-lp" style={{ marginTop: 14 }}>
          Persian itself splits maternal from paternal — <i>amu</i> vs <i>dāyi</i> for uncles,
          <i> amme</i> vs <i>khāle</i> for aunts — so these loans slotted neatly into a distinction
          South Asian languages already made. One honest caveat: not every Muslim-register word is a
          loan. <b>Mama, Chacha, Nana, Dada</b> are old Indic nursery words shared across communities;
          the genuine borrowings are the aunt, parent and in-law terms above.
        </p>
        <p className="kx-lp" style={{ marginBottom: 0 }}>
          And the edges of the map, now both in the table: <b>Kashmiri</b> (Dardic) keeps a native
          core that owes nothing to either Sanskrit or Arabic — <i>Mol, Mouj, Poph, Mass, Maam</i> —
          a genuine third system. And the <b>Iranian</b> family — Pashto, Balochi, Dari — are the
          actual relatives of Persian: Pashto's <i>Tarbur</i> (father's brother's son) doubles as the
          word for <i>rival</i>, and Dari quietly breaks with Iran's Persian by using <i>Kaka</i> for
          the paternal uncle and <i>Mama</i> for the maternal one.
        </p>
      </div>
    </div>
  );
}

function quizable(langId) {
  return REL.filter((r) => {
    const tm = r.terms[langId];
    return tm && tm.r && tm.r !== "by name" && tm.r !== "—" && r.cat !== "parents";
  });
}
const _qd = {};
function quizDistinct(langId) {
  if (_qd[langId] == null) _qd[langId] = new Set(quizable(langId).map((r) => r.terms[langId].r)).size;
  return _qd[langId];
}
const THIN_MAX = 8; // below this many distinct quizable terms, the quiz pool is too small to be fair
function pickOne(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function makeQuestion(langId, dir) {
  const pool = quizable(langId);
  const ans = pickOne(pool);
  const used = new Set([ans.terms[langId].r]);
  const distract = [];
  let guard = 0;
  while (distract.length < 3 && guard < 300) {
    guard++;
    const c = pickOne(pool);
    const v = c.terms[langId].r;
    if (!used.has(v)) { used.add(v); distract.push(c); }
  }
  const options = [ans, ...distract].map((r) => ({ id: r.id, rel: r.label, term: r.terms[langId].r }));
  for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const tmp = options[i]; options[i] = options[j]; options[j] = tmp; }
  return { ansId: ans.id, dir, rel: ans.label, term: ans.terms[langId].r, native: ans.terms[langId].n, options };
}

function QuizView() {
  const [langId, setLangId] = useState("hi");
  const [dir, setDir] = useState("rel2term");
  const [q, setQ] = useState(() => makeQuestion("hi", "rel2term"));
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const next = (lid, d) => { setQ(makeQuestion(lid, d)); setPicked(null); };
  const onPick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = q.options[i].id === q.ansId;
    setScore((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
  };
  const setLang = (lid) => { setLangId(lid); setScore({ right: 0, total: 0 }); next(lid, dir); };
  const setDirection = (d) => { setDir(d); setScore({ right: 0, total: 0 }); next(langId, d); };
  const langName = LANGS.find((l) => l.id === langId).name;
  const promptIsRel = q.dir === "rel2term";
  const thin = quizDistinct(langId) < THIN_MAX;

  return (
    <div className="kx-quiz">
      <div className="kx-qtop">
        <div className="kx-seg">
          <button className="kx-segb" data-on={dir === "rel2term"} onClick={() => setDirection("rel2term")}>relative → name</button>
          <button className="kx-segb" data-on={dir === "term2rel"} onClick={() => setDirection("term2rel")}>name → relative</button>
        </div>
        <span className="kx-qscore">Score {score.right}/{score.total}</span>
      </div>
      <div className="kx-qlang">
        {LANGS.map((l) => (
          <button key={l.id} className="kx-lf" data-on={l.id === langId} data-fam={l.fam} onClick={() => setLang(l.id)}>
            {l.name}{quizDistinct(l.id) < THIN_MAX && <span className="kx-thin">core</span>}
          </button>
        ))}
      </div>

      {thin && (
        <div className="kx-caveat">
          <b>{langName}</b> has only {quizDistinct(langId)} well-documented terms in this set, so this
          quiz draws from a small core and will repeat. It&rsquo;s a practice aid, not a measure of the
          language&rsquo;s real depth.
        </div>
      )}

      <div className="kx-qstem">{promptIsRel ? "In " + langName + ", what do you call your…" : "This " + langName + " word names which relative?"}</div>
      <div className="kx-qword">{promptIsRel ? q.rel : q.term}</div>
      {promptIsRel ? <div className="kx-qsub">tap the right term</div> : (q.native ? <div className="kx-qsub">{q.native}</div> : <div className="kx-qsub">tap the relationship</div>)}

      <div className="kx-qopts">
        {q.options.map((o, i) => {
          let state = "";
          if (picked !== null) {
            if (o.id === q.ansId) state = "correct";
            else if (i === picked) state = "wrong";
          }
          return (
            <button key={i} className="kx-qopt" data-state={state} disabled={picked !== null} onClick={() => onPick(i)}>
              <span className="ix">{String.fromCharCode(65 + i)}</span>
              <span>{promptIsRel ? o.term : o.rel}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="kx-qnext" aria-live="polite">
          <span className="kx-qexpl">
            {q.options[picked].id === q.ansId ? "Correct — " : "Not quite — "}
            <b>{q.rel}</b> is <b>{q.term}</b>{q.native ? " (" + q.native + ")" : ""}.
          </span>
          <button className="kx-btn" onClick={() => next(langId, dir)}>Next →</button>
        </div>
      )}
    </div>
  );
}

function LangFilter({ on, setOn, multi, setMulti, showNative, setShowNative }) {
  const ids = LANGS.map((l) => l.id);
  const setAll = () => setOn(new Set(ids));
  const setFam = (fam) => setOn(new Set(LANGS.filter((l) => l.fam === fam).map((l) => l.id)));
  const famActive = (fam) => {
    const f = LANGS.filter((l) => l.fam === fam).map((l) => l.id);
    return on.size === f.length && f.every((x) => on.has(x));
  };
  const allActive = on.size === ids.length;
  const clickLang = (id) => {
    if (multi) {
      setOn((prev) => { const n = new Set(prev); if (n.has(id)) { if (n.size > 1) n.delete(id); } else n.add(id); return n; });
    } else {
      setOn(new Set([id]));
    }
  };
  return (
    <div className="kx-filter">
      <div className="kx-frow">
        <span className="kx-flabel">Show</span>
        <button className="kx-fq" data-on={allActive} onClick={setAll}>All {ids.length}</button>
        {FAM_ORDER.map((fam) => (
          <button key={fam} className="kx-fq" data-on={famActive(fam)} data-fam={fam} onClick={() => setFam(fam)}>{FAM[fam].name}</button>
        ))}
        <span className="kx-spacer" />
        <button type="button" className="kx-ftoggle" onClick={() => setMulti(!multi)} aria-pressed={multi}>
          <span className="kx-sw sm" data-on={multi} /> compare
        </button>
      </div>
      <div className="kx-langfilter">
        {LANGS.map((l) => (
          <button key={l.id} className="kx-lf" data-on={on.has(l.id)} data-fam={l.fam} aria-pressed={on.has(l.id)} onClick={() => clickLang(l.id)}>{l.name}</button>
        ))}
      </div>
      <div className="kx-fhint">
        <span>{multi ? "Compare mode — tap to add or remove languages." : "Tap any language to show only it."} <span className="kx-count">&middot; {on.size} of {ids.length} shown</span></span>
        <button type="button" className="kx-ntoggle" onClick={() => setShowNative(!showNative)} aria-pressed={showNative}>
          <span className="kx-sw sm" data-on={showNative} /> native script
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("trace");
  const [path, setPath] = useState([]);
  const [showNative, setShowNative] = useState(true);
  const [onLangs, setOnLangs] = useState(() => new Set(["hi", "ur", "bnbd", "ta"]));
  const [multi, setMulti] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch (e) {} };
  }, []);

  const langs = useMemo(() => LANGS.filter((l) => onLangs.has(l.id)), [onLangs]);
  const key = path.map((s) => s[1]).join("-");
  const rel = key ? PATHMAP[key] : null;

  const browseResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qRaw = query.trim();
    if (!q) return REL;
    return REL.filter((r) =>
      r.label.toLowerCase().includes(q) ||
      Object.values(r.terms).some((tm) => (tm.r || "").toLowerCase().includes(q) || (tm.n && qRaw && tm.n.includes(qRaw)))
    );
  }, [query]);

  return (
    <div className="kx">
      <style>{CSS}</style>
      <div className="kx-wrap">
        <header>
          <div className="kx-eyebrow">South Asian kinship &middot; a field guide</div>
          <h1 className="kx-h1">Who are they <em>to you?</em></h1>
          <p className="kx-lede">
            Trace a relationship from yourself and read its name across two dozen South Asian
            language columns &mdash; grouped by four language families, whose kinship logic
            diverges most sharply at the cousins.
          </p>
          <div className="kx-legend">
            <span className="kx-leg"><span className="kx-dot" style={{ background: "var(--indo)" }} /> Indo-Aryan &middot; Hindi, Urdu, Bengali ×2, Sylheti, Punjabi ×2, Saraiki, Gujarati, Marathi, Nepali, Sindhi, Rohingya, Chittagonian, Odia, Assamese</span>
            <span className="kx-leg"><span className="kx-dot" style={{ background: "var(--dard)" }} /> Dardic &middot; Kashmiri</span>
            <span className="kx-leg"><span className="kx-dot" style={{ background: "var(--iran)" }} /> Iranian &middot; Pashto, Balochi, Dari</span>
            <span className="kx-leg"><span className="kx-dot" style={{ background: "var(--drav)" }} /> Dravidian &middot; Tamil, Telugu, Kannada, Malayalam</span>
          </div>
        </header>

        <div className="kx-rule" />

        <div className="kx-tabs">
          {[["trace", "Trace"], ["browse", "Browse"], ["patterns", "Patterns"], ["practice", "Practice"]].map(([m, label]) => (
            <button key={m} className="kx-tab" data-on={mode === m} aria-pressed={mode === m} onClick={() => setMode(m)}>{label}</button>
          ))}
        </div>

        {mode === "trace" && (
          <>
            <div className="kx-panel">
              <p className="kx-sub">Your path</p>
              <div className="kx-trace">
                <span className="kx-node kx-you">you</span>
                {path.map((s, i) => (
                  <span className="kx-chip" key={i}>
                    <span className="kx-link" />
                    <span className="kx-node">
                      {s[0]}
                      {i === path.length - 1 && (
                        <button className="kx-x" aria-label="remove last step" onClick={() => setPath(path.slice(0, -1))}>&times;</button>
                      )}
                    </span>
                  </span>
                ))}
                {rel && (
                  <span className="kx-chip">
                    <span className="kx-link" />
                    <span className="kx-node kx-eq">
                      = {(langs.length === 1 && rel.terms[langs[0].id] && rel.terms[langs[0].id].r !== "by name" && rel.terms[langs[0].id].r) || rel.label}
                    </span>
                  </span>
                )}
              </div>

              {path.length > 0 && (
                <div className="kx-actions">
                  <button className="kx-mini" onClick={() => setPath(path.slice(0, -1))}>Undo</button>
                  <button className="kx-mini" onClick={() => setPath([])}>Clear</button>
                  {path.length >= 4 && <span className="kx-count">max 4 steps &mdash; remove one to branch differently</span>}
                </div>
              )}

              <div className="kx-palette">
                {STEPS.map((g) => (
                  <div className="kx-pgroup" key={g.group}>
                    <div className="kx-plabel">{g.group}</div>
                    <div className="kx-pbtns">
                      {g.items.map((it) => (
                        <button
                          className="kx-step"
                          key={it[1]}
                          disabled={path.length >= 4}
                          style={path.length >= 4 ? { opacity: 0.4, cursor: "not-allowed" } : null}
                          onClick={() => setPath([...path, it])}
                        >
                          + {it[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {path.length === 0 && (
                <div style={{ marginTop: 4 }}>
                  <div className="kx-plabel">Or try one</div>
                  <div className="kx-examples">
                    {EXAMPLES.map((ex, i) => (
                      <button className="kx-ex" key={i} onClick={() => setPath(ex.path)}>{ex.label}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="kx-vh" role="status">{path.length > 0 ? (rel ? "Result: " + rel.label : "No single dedicated term for this path") : ""}</div>
            <div>
            {path.length > 0 && rel && (
              <div className="kx-result">
                <TermCard rel={rel} langs={langs} showNative={showNative} />
              </div>
            )}
            {path.length > 0 && !rel && (
              <div className="kx-none">
                <span className="g">you &rarr; {path.map((s) => s[0]).join(" &rarr; ").replace(/&rarr;/g, "\u2192")}</span>
                This exact path doesn&rsquo;t resolve to a single dedicated term across these
                languages &mdash; beyond about three steps relatives are usually described by
                stringing the steps together. Try a shorter path; nearly every distinct kinship
                word lives within three hops of you.
              </div>
            )}
            </div>

            <LangFilter on={onLangs} setOn={setOnLangs} multi={multi} setMulti={setMulti} showNative={showNative} setShowNative={setShowNative} />
          </>
        )}

        {mode === "browse" && (
          <>
            <input
              className="kx-search"
              placeholder="Search a relationship or a word (e.g. chacha, athai, sister)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <LangFilter on={onLangs} setOn={setOnLangs} multi={multi} setMulti={setMulti} showNative={showNative} setShowNative={setShowNative} />

            {CATS.map((c) => {
              const rels = browseResults.filter((r) => r.cat === c.id);
              if (!rels.length) return null;
              return (
                <div className="kx-cat" key={c.id}>
                  <div className="kx-cathd">{c.title}</div>
                  {c.intro && <div className="kx-catintro">{c.intro}</div>}
                  {rels.map((r) => {
                    const isOpen = open === r.id;
                    return (
                      <div className="kx-acc" key={r.id}>
                        <button className="kx-accbtn" onClick={() => setOpen(isOpen ? null : r.id)}>
                          <span className="kx-acclabel">{r.label}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                            <span className="kx-accmeta">{sideOf(r.paths)}</span>
                            <span className="kx-caret" data-open={isOpen}>&#9654;</span>
                          </span>
                        </button>
                        {isOpen && (
                          <div className="kx-accbody">
                            <TermCard rel={r} langs={langs} showNative={showNative} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {browseResults.length === 0 && (
              <div className="kx-none" style={{ marginTop: 18 }}>
                Nothing matches &ldquo;{query}&rdquo;. Try a relationship in English (like &ldquo;uncle&rdquo; or
                &ldquo;sister&rsquo;s son&rdquo;) or a term you already know.
              </div>
            )}
          </>
        )}

        {mode === "patterns" && <PatternsView />}
        {mode === "practice" && <QuizView />}

        <div className="kx-foot">
          <b>A note on accuracy.</b> Twenty-four columns across four families — Indo-Aryan, Dardic
          (Kashmiri), Iranian (Pashto, Balochi, Dari) and Dravidian. Roman transliteration is the
          primary reference; native script is shown where reliable (and for Pashto and Dari), and
          &ldquo;—&rdquo; marks a cell not yet recorded for a language rather than a missing
          relationship. Bengali appears as <b>two co-equal columns</b> (Bangladesh and West Bengal),
          and Punjabi likewise (Pakistan and India), since each pair really does diverge — the labels
          are shorthand for the dominant register, not a hard religious or national line. Documentation
          thins out fast past the big languages: <b>Balochi</b> is the sparsest (a few cells are
          reconstructed from related Iranian forms), and <b>Saraiki, Rohingya and Chittagonian</b> are
          covered at the core and approximate elsewhere. Kashmiri folds cousins into siblings; Dravidian
          in-law terms shift by the speaker's gender; Odia and Assamese carry heavy dialect variation.
          Treat this as a well-grounded guide, not a final ruling for any one household. Spotted
          something off for your family's usage? That variation is itself the point.
        </div>
      </div>
    </div>
  );
}
