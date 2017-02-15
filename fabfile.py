from __future__ import with_statement
from fabric.api import local, settings, abort, run, cd, env, put, hosts, run
from fabric.contrib.console import confirm

def deploy():
    local("cp -r deploy/* ../bdjewkes.github.io/lilbear/")
    local("cd ../bdjewkes.github.io/ & git add lilbear & git commit -m \"deploy lilbear\" & git push")