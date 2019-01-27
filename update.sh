#!/bin/sh
apt-ftparchive packages ./debfiles/ > ./Packages;
sed -i -e '/^SHA/d' ./Packages;
bzip2 -c9k ./Packages > ./Packages.bz2;
printf "Origin: julioverne's Repo\nLabel: julioverne\nSuite: stable\nVersion: 1.0\nCodename: julioverne\nArchitecture: iphoneos-arm\nComponents: main\nDescription: julioverne's Tweaks\nMD5Sum:\n "$(cat ./Packages | md5sum | cut -d ' ' -f 1)" "$(stat ./Packages --printf="%s")" Packages\n "$(cat ./Packages.bz2 | md5sum | cut -d ' ' -f 1)" "$(stat ./Packages.bz2 --printf="%s")" Packages.bz2\n" >Release;
ls ./debfiles/ -t | grep '.deb' | head -5 | perl -e 'use JSON; @in=grep(s/\n$//, <>); $count=0; foreach $fileNow (@in) { $fileNow = "./debfiles/$fileNow"; $size = -s $fileNow; $section= `dpkg -f $fileNow Section | tr -d "\n\r"`; $name= `dpkg -f $fileNow Name | tr -d "\n\r"`; $version= `dpkg -f $fileNow Version | tr -d "\n\r"`; $package= `dpkg -f $fileNow Package | tr -d "\n\r"`; $time= `date -r $fileNow +%s | tr -d "\n\r"`; @in[$count] = {section=>$section, package=>$package, version=>$version, size=>$size+0, time=>$time+0, name=>$name}; $count++; } print encode_json(\@in)."\n";' > last.updates;
exit 0;