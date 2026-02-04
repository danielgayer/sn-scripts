/**
* Installs a list of plugins and applications.
*
* @author Maik Skoddow
* @param {Array} arrToBeInstalled
*    List of plugin IDs or application scope to be installed
* @param {Boolean} dryRun
*    If `true` only output is given but no installations are performed
* @param {Boolean} loadDemoData
*    If `false` demo data is not installed
*/
function installPluginsAndApplications(arrToBeInstalled, dryRun, loadDemoData) {

    if (!Array.isArray(arrToBeInstalled) || arrToBeInstalled.length === 0) {
        gs.error('Parameter "arrToBeInstalled" does not represent a valid array!');
    }

    var _dryRun           = typeof dryRun === 'boolean' ? dryRun : false;
    var _loadDemoData     = typeof loadDemoData === 'boolean' ? loadDemoData : false;
    var _objToBeInstalled = {};
    var _grPlugins        = new GlideRecord('v_plugin');
    var _grRemoteApps     = new GlideRecord('sys_remote_app');
    var _grInstalledApps  = new GlideRecord('sys_store_app');

    Array.forEach(arrToBeInstalled, function(strID) {
        if (_grPlugins.get('id', strID)) {
            if (_grPlugins.getValue('active') == 'active') {
                gs.warn(
                    'Plugin "{0}" (ID: {1}) is already installed!', 
                    _grPlugins.name, strID
                );
            }
            else {
                _objToBeInstalled[strID] = {
                    "plugin_id" : strID,
                    "scope"     : _grPlugins.getValue('scope'),
                    "app_name"  : _grPlugins.getValue('name'),
                    "loadDemoData" : _loadDemoData,
                    "isPlugin"  : true
                }

                gs.info(
                    'Queue Plugin "{0}" (ID: {1}) for installation', 
                    _grPlugins.getValue('name'), strID
                );
            }
        }
        else if (_grInstalledApps.get('scope', strID)) {
            gs.warn(
                'Application "{0}" (ID: {1}) is already installed!', 
                _grInstalledApps.name, strID
            );
        }
        else if (_grRemoteApps.get('scope', strID)) {
            _objToBeInstalled[_grRemoteApps.getUniqueValue()] = {
                "sys_id"    : _grRemoteApps.getUniqueValue(),
                "app_name"  : _grRemoteApps.getValue('name'),
                "loadDemoData": _loadDemoData,
                "isStoreApp": true,
                "appScope"  : strID,
                "versionObj": {
                    "version": _grRemoteApps.getValue('latest_version')
                }
            }                

            gs.info(
                'Queue Application "{0}" (ID: {1}) for installation', 
                _grRemoteApps.getValue('name'), strID
            );
        }
        else {
            gs.error('"{0}" is not a valid plugin or application ID!', strID)
        }
    });
        
    if( Object.keys(_objToBeInstalled).length > 0 ) {
        gs.info(
            'Start installation of {0} plugins and applications... ',
            Object.keys(_objToBeInstalled).length
        );
        if (!_dryRun) {
            gs.info(
                new sn_appclient.AppPluginInstallation().validateAndBatchInstall(
                    'PDI Installation', 
                    _objToBeInstalled
                )
            );
            gs.info(
                'To follow the installation progress, go to sys_batch_install_plan: https://{0}.service-now.com/now/nav/ui/classic/params/target/sys_batch_install_plan_list.do', gs.getProperty('instance_name')
            );
        }
    } else {
        gs.info(
            'No plugins or applications will be installed...'
        );
    }
}

installPluginsAndApplications([
    'com.glide.messaging.awa', //Conversational Messaging
    'com.snc.incident.mim', //Major Incident Management
    'com.snc.change_management.risk_assessment', //Change Management - Risk Assesment
    'com.snc.change_management.success_probability', //Change Management - Success Probability
    'com.snc.pa.change', //Performance Analytics Content Pack for Change Management
    'com.snc.incident.awa', //Advanced Work Assignment for Incidents
    'com.snc.incident.universal_request', //Universal Request for Incident Integration

    'com.glide.cs.chatbot', //Virtual Agent
    'com.glideapp.cs.sm_topic_blocks', //Service Management Virtual Agent Topic Blocks
        
    'com.snc.itom.discovery.license', //ITOM Discovery License
    'sn_getwell', //CMDB and CSDM Data Foundations Dashboards

    'com.snc.financial_planning_pmo', //PPM
    'com.snc.project_management_v3', //Project Management 
    'com.snc.sdlc.agile.2.0', //Agile Development
    'com.snc.sdlc.safe', //Essential SAFe
    'com.snc.sdlc.agile.multi_task', //Unified Backlog
    'com.snc.test_management.2.0', //Test Management
    'com.snc.release_management_v2', //Release Management
    'sn_pw', //Project Workspace
    'sn_dpm', //Digital Portfolio Management
    'sn_service_builder', //Service Builder

    'com.sn_customerservice', //Customer Service Management
    'com.sn_communities', //Communities
    'com.sn_shn', //Special Handling Notes
        
    'com.snc.work_management', //FSM Base
    'com.snc.service_management.geolocation', //Service Management Geolocation
    'sn_fsm_disp_wrkspc', //Dispatcher Workspace
    'sn_fsm_pm', //Planned Maintenance
    'com.sn_fsm_mobile', //Mobile App
    'com.snc.fsm_capacity_management', //Field Service Capacity and Reservations Management
    'com.snc.fsm_crew_scheduling', //Field Service Crew Operations
    'com.snc.time_recording_fsm', //Time Recording
    'com.snc.work_management.demo', //FSM Demo Data

    'com.snc.integration.multifactor.authentication', //MFA
    'com.snc.integration.sso.multi.installer', //SSO
    'sn_access_analyzer', //Access Analyzer
    'com.snc.documentviewer', //Document Viewer
    'com.snc.linkgenerator', //Link Generator
    'com.snc.document_management', //Managed Documents
    'com.glide.quiz_designer', //Quiz Designer
    'sn_vsc', //Security Center    

    //Custom attachements
    'com.glide.ux.starter.experience', //UX Starter Experience
    'com.glide.app_collaboration', //App Collaboration
    'com.glide.creator_studio.global', //Creator Studio - Global
    'com.glide.cs.commons', //Glide Conversation Server Commons
    'com.servicenow_now_carousel_text', //@servicenow/now-carousel-text
    'com.snc.discovery', //Discovery
    'com.snc.discovery.ip_based', //Discovery - IP Based
    'com.snc.discovery.error', //Discovery use of ITOM errors
    'com.snc.svc_err_mgmt.base', //Base ITOM Error Management
    'com.snc.svc_err_mgmt', //Service Error Management
    'com.snc.discovery.core', //Discovery Core
    'com.snc.discovery.results_ui', //Discovery Results UI
    'com.snc.itom.license', //ITOM Licensing
    'com.snc.discovery.schedule_config', //Discovery Schedule Configuration
    'com.snc.discovery.api', //Discovery API
    'com.snc.puppet.core', //Puppet Configuration Management Core
    'com.snc.service-watch.commons', //Service Watch Suite commons
    'com.snc.cloud.core', //Cloud Provisioning and Governance Core
    'com.snc.pattern.designer', //Pattern Designer
    'com.snc.cloud.api', //Cloud API
    'com.snc.ng.pattern.designer', //Pattern Designer (NG version)
    'paris.pattern.engine', //Paris Pattern Engine
    'com.sn_servicemodeldesigner', //Service Model Designer
    'com.sn_sra.global', //Release Automation Global
    'com.glideapp.workflow.fd_launcher', //Workflow Flow Designer Launcher
    'com.snc.itom.daw', //ITOM Discovery Admin Workspace
    'com.snc.service-watch', //Event Management and Service Mapping Core
    'com.itom-map-app', //Service Mapping – Map
    'com.snc.service-mapping', //Service Mapping
    'com.glideapp.itom.snac', //Event Management
    'com.snc.sa.analytics', //Service Analytics
    'com.snc.sa.mid.webserver', //Mid Web Server
    'com.em-alert-mgmt-content', //Alert Management Content
    'com.itom-noc-app', //Operator Workspace (DEPRECATED)
    'com.glideapp.itom.snac.perf.acc', //Event Management Performance Accelerator
    'com.snc.sa.accutils', //Agent Client Collector Global Utilities
    'com.glide.hub.action_step.soap', //ServiceNow IntegrationHub Action Step - SOAP
    'com.glide.hub.action_type.datastream', //ServiceNow IntegrationHub Action Template - Data Stream
    'com.snc.itom.discovery.license', //ITOM Discovery License
    'com.glide.hub.action_step.get_connection_info', //ServiceNow IntegrationHub Action Step - Get Connection Info
    'com.snc.itom.vis.license', //ITOM Visibility License
    'com.glide.data_services_canonicalization.client', //Normalization Data Services Client
    'com.snc.discovery.file_based_discovery', //File Based Discovery
    'com.snc.file_signature_normalization', //Software Asset Management - File Signature Normalization
    'com.snc.itom.smart.content', //ITOM Smart Content
    'com.snc.pa.premium', //Performance Analytics - Premium
    'com.glideapp.report.em', //Event Management Overview Homepage
    'com.snc.pa.em', //Performance Analytics - Content Pack - Event Management
    'com.snc.clotho', //MetricBase
    'com.glide.highcharts', //Highcharts Reporting
    'com.snc.sa.metric', //Metric Intelligence
    'com.snc.agent.distributed.cluster', //MID Server Distributed Cluster
    'com.snc.sa.metric.health', //Operational Intelligence - Extension Health Monitoring
    'com.snc.extended_cmdb', //Extended CMDB
    'com.snc.sams', //Software Asset Management Foundation
    'com.snc.samp', //Software Asset Management Professional
    'com.snc.sam.core', //Software Asset Management Core
    'com.snc.samp.core', //Software Asset Management Professional Core
    'com.snc.pa.samp', //Performance Analytics - Content Pack - Software Asset Management Professional
    'com.snc.pa.spotlight', //Performance Analytics - Spotlight
    'com.snc.pa.premium.sam', //Performance Analytics Premium for Software Asset Management
    'com.sn_samp_workbench', //Software Asset Management - Common UI Components
    'com.glide.hub.action_step.xmlparser', //ServiceNow IntegrationHub Action Step - XML Parser
    'com.sn_samp_adobe', //Software Asset Management Professional for Adobe
    'com.sn_samp_master', //Activate all Software Asset Management Professional plugins (do not activate...use 'Activate all Sof
    'com.sn_samp_citrix', //Software Asset Management Professional for Citrix
    'com.sn_samp_ibm', //Software Asset Management Professional for IBM
    'com.sn_samp_sap', //Software Asset Management Professional for SAP
    'com.snc.samp.microsoft', //Software Asset Management Professional for Microsoft
    'com.sn_samp_vmware', //Software Asset Management Professional for VMware
    'com.snc.samp.oracle', //Software Asset Management Professional for Oracle
    'com.sn_samp_eng_app', //Software Asset Management Professional for Engineering Applications
    'com.glide.integration_studio', //Integration Studio API
    'sn_tsom_patterns', //Telecom Discovery Patterns
    'sn_tsom_core', //Telecom Service Operations Core
    'sn_sgc_central', //SGC Central
    'sn_agent', // Agent Client Collector Framework
    'sn_acc_wrksp', // ACC Admin Workspace 
    'sn_disco_certmgmt', //Certificate Inventory and Management
    'sn_itom_infra_ws', //ITOM Infra Services Workspace
    'sn_itom_cam', //Cloud Workspace
    'sn_ac', //Automation Center
    'sn_acc_vis_content', //Agent Client Collector for Visibility Content
    'com.snc.cmdb.csdm.activation', //CSDM Activation
    'sn_em_ai', //Event Management Core
    'sn_sow_itom_cont', //Service Operations Workspace ITOM Apps
    'sn_itom_uib_comp', //Service Operations Workspace UI Components
    'sn_apm_mdtl', //Enterprise Modeling and Visualization
    'sn_sow_em_um', //Service Operations Workspace Service Map Monitoring
    'sn_itom_cloud_svc' //ITOM Cloud Services Core
    
]);
