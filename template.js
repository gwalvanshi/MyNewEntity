var $toTagBox,$ccTagBox,$bccTagBox,$toEmailTagBox,$ccEmailTagBox,$bccEmailTagBox;
var SystemdropdownMasterData=[];
$(document).ready(function () {
    $("#txtCommunicationEditor").Editor();
    LoadCombo('ddlCommType', 'CommTypeMaster', 'Name', 'CommTypeMaster_ID', 'ISDeleted=0');
    LoadCombo('ddlCommTemplate', 'CommTemplateMaster', 'TemplateName', 'CommTemplateMaster_Id', 'ISDeleted=0');
    LoadSystemMasterDropdown('ddlCommMode',SystemMasterTableEnum.CommMode);

    $toEmailTagBox = $("#toEmailTagBox").dxTagBox({
        openOnFieldClick: false,
        placeholder:"Enter emails",
        acceptCustomValue: true
    }).dxTagBox('instance');

    $ccEmailTagBox = $("#ccEmailTagBox").dxTagBox({
        openOnFieldClick: false,
        placeholder:"Enter emails",
        acceptCustomValue: true
    }).dxTagBox('instance');

    $bccEmailTagBox = $("#bccEmailTagBox").dxTagBox({
        openOnFieldClick: false,
        placeholder:"Enter emails",
        acceptCustomValue: true
    }).dxTagBox('instance');

    CommonAjaxMethod('/Communication/Template/GetTreeViewDataOfClassEmpDept', {
                ASGMapping_Id: sessionStorage.getItem('ASGMapping_Id'),
                ScreenID: NavMenuConstants.TREE_DATA_CLASS_EMP_DEPT}, false, 'GET',function(res){
        var treeData=[];        
        if (res && res.dataCollection.length > 0) {
            treeData=res.dataCollection;
        }
            var tagDataSource = new DevExpress.data.DataSource({
                    store: treeData,
                    key: "New_Id",
                    group: "ParentId"
                });

                $toTagBox = $("#toTagBox").dxTagBox({
                    dataSource: tagDataSource,
                    displayExpr: "DisplayName",
                    valueExpr: "New_Id",
                    showSelectionControls: true,
                    searchEnabled: true,
                    grouped: true,
                }).dxTagBox('instance');

                $ccTagBox = $("#ccTagBox").dxTagBox({
                    dataSource: tagDataSource,
                    displayExpr: "DisplayName",
                    valueExpr: "New_Id",
                    showSelectionControls: true,
                    searchEnabled: true,
                    grouped: true,
                }).dxTagBox('instance');

                $bccTagBox = $("#bccTagBox").dxTagBox({
                    dataSource: tagDataSource,
                    displayExpr: "DisplayName",
                    valueExpr: "New_Id",
                    showSelectionControls: true,
                    searchEnabled: true,
                    grouped: true,
                }).dxTagBox('instance');
    });

    $("#ddlCommTemplate").on('change',function (e) {
        if(e.target.value){
            loadData(e.target.value);
        }
    });

    $("#btnSave").click(function () {
        saveCommunicationTemplate();
    });

    $("#btnCancel").click(function () {
        window.location.href="/Start/Erp/Index?Id="+NavMenuConstants.COMMUNIACATION_CRUD_MENUCODE;
    });
});
function loadEditData(){
    let templateId=$('#hdnCommunicationId').val();
    loadData(templateId);
}

function loadData(templateId){
    if(templateId>0){
        CommonAjaxMethod('/Communication/Template/Get', {id: templateId,
                SgMapping_id: sessionStorage.getItem('SgMapping_id'),
                ScreenID: NavMenuConstants.COMMUNIACATION_CRUD_MENUCODE}, false, 'GET', function (res) {
                if (res && res.dataCollection.length > 0) {
                    let data = res.dataCollection[0];
                    $('#txtCommunicationName').val(data.TemplateName);
                    $('#txtSubject').val(data.Subject);
                    $('#ddlCommType').val(data.CommTypeMaster_Id);
                    $('#ddlCommMode').val(data.CommMode);
                    $('#hdnAttachmentPath1').val(data.Attachment1);
                    $('#txtCommunicationEditor').Editor('setText', data.MailSMSBody);
                    if(data.ToRecipients){
                        $toTagBox.option('value',data.ToRecipients.split(','));
                    }
                    if(data.CcRecipients){
                        $ccTagBox.option('value',data.CcRecipients.split(','));
                    }
                    if(data.BccRecipients){
                        $bccTagBox.option('value',data.BccRecipients.split(','));
                    }
                    if(data.ToEmail){
                        $toEmailTagBox.option('value',data.ToEmail.split(','));
                    }
                    if(data.CcEmail){
                        $ccEmailTagBox.option('value',data.CcEmail.split(','));
                    }
                    if(data.BccEmail){
                        $bccEmailTagBox.option('value',data.BccEmail.split(','));
                    }
                }
            });
        }
}

function saveCommunicationTemplate() {
    let GenericModeldata =
    {
        ASGMapping_Id: sessionStorage.getItem('ASGMapping_Id'),
        SgMapping_id: sessionStorage.getItem('SgMapping_id'),
        MenuCode:sessionStorage.getItem('MenuCode'),
        MenuID:sessionStorage.getItem('MenuId'),
        StuStaffTypeId:sessionStorage.getItem('StuStaffTypeId'),
        Lang:sessionStorage.getItem('Lang'),
        ScreenID: NavMenuConstants.COMMUNIACATION_CRUD_MENUCODE,
        UserID: sessionStorage.getItem('CUserId'),
        Operation: parseInt($('#hdnCommunicationId').val()) == 0 ? "add" : "update",
        Rows: {
            Data: [{
                RowIndex: 0,
                KeyName: "CommTemplateId",
                ValueData: $('#hdnCommunicationId').val()
            }, {
                RowIndex: 0,
                KeyName: "TemplateName",
                ValueData: $('#txtCommunicationName').val()
            }, {
                RowIndex: 0,
                KeyName: "CommTypeId",
                ValueData: $('#ddlCommType').val()
            }, {
                RowIndex: 0,
                KeyName: "CommModeId",
                ValueData: $('#ddlCommMode').val()
            }, {
                RowIndex: 0,
                KeyName: "To",
                ValueData: $toTagBox._selectedItems.map(x=>x.New_Id).join()
            }, {
                RowIndex: 0,
                KeyName: "Cc",
                ValueData: $ccTagBox._selectedItems.map(x=>x.New_Id).join()
            }, {
                RowIndex: 0,
                KeyName: "Bcc",
                ValueData:$bccTagBox._selectedItems.map(x=>x.New_Id).join()
            },{
                RowIndex: 0,
                KeyName: "ToEmails",
                ValueData: $toEmailTagBox.option('value').join()
            }, {
                RowIndex: 0,
                KeyName: "CcEmails",
                ValueData: $ccEmailTagBox.option('value').join()
            }, {
                RowIndex: 0,
                KeyName: "BccEmails",
                ValueData:$bccEmailTagBox.option('value').join()
            },{
                RowIndex: 0,
                KeyName: "Subject",
                ValueData:$('#txtSubject').val()
            }, {
                RowIndex: 0,
                KeyName: "Template",
                ValueData: $('#txtCommunicationEditor').Editor('getText')
            }]
        }
    }

    CommonAjaxMethod('/Communication/Template/Save', GenericModeldata, false, 'POST');
}

function deleteCommunicationTemplate() {
    if (!confirm("Are you sure you want to delete this template?"))
        return;

    let GenericModeldata =
    {
        ASGMapping_Id: sessionStorage.getItem('ASGMapping_Id'),
        ScreenID: NavMenuConstants.COMMUNIACATION_CRUD_MENUCODE,
        UserID: sessionStorage.getItem('CUserId'),
        Operation: "Delete",
        Rows: {
            Data: [{
                RowIndex: 0,
                KeyName: "CommTemplateId",
                ValueData: $('#hdnCommunicationId').val()
            }]
        }
    }
    CommonAjaxMethod('/Communication/Template/Save', GenericModeldata, false, 'POST');
}