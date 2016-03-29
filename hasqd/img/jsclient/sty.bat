cd eng
sh ../stylejs.sh hq_eng_core.js
sh ../stylejs.sh hq_eng_parsers.js
sh ../stylejs.sh sh_eng_ajax.js
sh ../stylejs.sh sh_eng_parsers.js
sh ../stylejs.sh sh_hash_md5.js
sh ../stylejs.sh sh_hash_rmd160.js
sh ../stylejs.sh sh_hash_sha256.js
sh ../stylejs.sh sh_hash_sha512.js
sh ../stylejs.sh sh_hash_smd.js
sh ../stylejs.sh ts_eng_core.js
sh ../stylejs.sh ts_eng_nc.js
sh ../stylejs.sh ts_search.js
cd ..

cd front
sh ../stylejs.sh hq_dyn_base.js
sh ../stylejs.sh hq_dyn_tokens_tab.js
sh ../stylejs.sh hq_html_base.js
sh ../stylejs.sh hq_html_help_tab.inc
sh ../stylejs.sh hq_html_tokens_tab.js
sh ../stylejs.sh sh_dyn.js
sh ../stylejs.sh ts_dyn_base.js
sh ../stylejs.sh ts_html_base.js
sh ../stylejs.sh ts_message.js
cd ..

cd ui
sh ../stylejs.sh hq_ui_doc_main.js
sh ../stylejs.sh node_main.js
sh ../stylejs.sh ts_ui_doc_main.js
cd ..
