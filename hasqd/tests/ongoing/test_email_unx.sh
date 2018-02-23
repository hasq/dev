#!/bin/bash
if [ -z "$1" ]
then
	echo "Please enter your email"
	exit
fi
ssmtp -v -C /etc/ssmtp/ssmtp.conf "$1" << EOF
To: kg@hasq.org
From: hasqsvn@gmail.com
Subject: ssmtp test!
Content-type: text/html

Hello!
EOF
