#pragma once

void ask(const string & prompt, string & value, bool word = true);
void confirm(const string prompt, const string & value);
string find_cfg_on_hd();
HqConf load_cfg(string cfg_on_hd);
HqConf load_cfg_cd();
void ask_questions(HqConf & cfg);
void run_console();
void start_hasq_srv_at(string cfg_on_hd);
void write_cfg(const HqConf & cfg, string path);
string writableHd();
bool formatHd();

namespace debug
{
extern bool flag;
void o(const string &, int = -1);
}
