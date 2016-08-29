
How to compile Hasq server source code
--------------------------------------

Prerequisites

  - make utility, MS cl (v16) or g++ (v4.8) compiler
  - OS: Linux or Windows XP or higher

      An easy way to compile under Windows is to use ap14 set of tools
      from http://hasq.org/release/latest/tools/ap14/


How to build

  - in the 'src' directory type
           'make PLAT=unx' if you compile under Linux
        or 'make PLAT=msc' if you compile in ap14 environment
  - hasqd executable will be located in '_bin_unx'
    or '_bin_msc' respectively


Release 0.4.2, build 1220 (github)
-------------------------

   - Hasq server:
     - added "dagt" command line option
     - added "dtcp" command line option
     - added "drop_dir" command line option
     - added "drop_timeout" command line option
     - added "http_proxy" command line option
     - renamed "proxy" command line option to "tunnel"
     - added "agent" HSL command
     - added "net protocol" HSL command
     - added "drop" network command
     - added "info log agent" network command
     - added "unlink" network command
     - renamed "proxy" network command to "tunnel"
     - removed "http_get" network command
     - removed "http_post" network command
     

Release 0.4.1, build 727 (github)
-------------------------

   - Hasq server:
     - fixed conflict resolution algorithm
     - added "zlim" command line option
     - added "workDelay" command line option
     - fixed "add" command with N=0
     - SMD hash function added
     
   - TokenSwap JavaScript Client added

   - Hasq JavaScript Client:
     - Tokens tab help updated
     - Added Admin mode function
     
     
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
