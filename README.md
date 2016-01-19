# Sources and Development


How to compile Hasq server source code
--------------------------------------

Prerequisites

  - make utility, MS cl (v16) or g++ (v4.8) compiler
  - OS: Linux or Windows XP or higher

      An easy way to compile under Windows is to use ap14 set of tools
      from https://github.com/hasq/release/tree/master/tools/ap14


How to build

  - in the 'src' directory type
           'make PLAT=unx' if you compile under Linux
        or 'make PLAT=msc' if you compile in ap14 environment
  - hasqd executable will be located in '_bin_unx'
    or '_bin_msc' respectively



Release 0.3.1, build 1463
-------------------------

   - Hasq server codebase
     - default number of workers increased to 4

   - Hasq JavaScript Client:
     - Help tab
     - Progress indicator

   - Website
     - Hasq JavaScript Client help added (Hasq_JSClient.pdf)
     - Hasq architecture document added (Hasq_arch.pdf)
     - ISO image with Tynicore Linux and pre-installed
       Hasq server added (hasq-0.3.1.iso)

   - DB Wizard utility added (wizdb)
   - minor changes to Hasq_CLO.pdf

