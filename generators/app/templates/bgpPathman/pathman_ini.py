#! /usr/bin/env python2.7
"""
    * Copyright (c) 2015 by Cisco Systems, Inc.
    * All rights reserved.
    
    Pathman init file
    
    Niklas Montin, 20140705, niklas@cisco.com
    

    odl_ip - ip address of odl controller
    odl_port -  port for odl rest on controller
    odl_user - username for odl rest access
    odl_password - password for odl rest access
    
    log_file - file to write log to - level INFO default
    log_size - max size of logfile before it rotates
    log_count - number of backup version of the log
    
    
    """


log_size = 100000
log_count = 3
odl_ip = '<%= props.odl_ip %>'
odl_port = '<%= props.odl_port %>'
odl_user = '<%= props.odl_user %>'
odl_password = '<%= props.odl_password %>'
log_file = '/tmp/pathman.log'