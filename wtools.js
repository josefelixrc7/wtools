
var wtools =
{
    CSVOperator: class
    {
        constructor(table, filename = "")
        {
            this.table = table;
            this.filename = filename;
        }
        DownloadCSVFile_ = (csv_data) =>
        {
            let csv_file, download_link;
        
            csv_file = new Blob([csv_data], {type: "text/csv"});
        
            download_link = document.createElement("a");
            download_link.download = this.filename;
            download_link.href = window.URL.createObjectURL(csv_file);
            download_link.style.display = "none";
            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);
        }
        TableToCSV_ = () =>
        {
            let data = [];
            let rows = document.querySelectorAll(`${this.table} tr`);
        
            for (let i = 0; i < rows.length; i++)
            {
                let row = [], cols = rows[i].querySelectorAll("td, th");
        
                for (let j = 0; j < cols.length; j++)
                    row.push(cols[j].innerText);
        
                data.push(row.join("\t"));
            }
        
            return data.join("\n");
        }
    }
    ,
    ElementState: class
    {
        constructor(element, active, type, text_to_change)
        {
            this.element = element;
            this.active = active;
            this.type = type;
            this.text_to_change = text_to_change;
            this.text_original = $(element).text();
    
            if(active) this.On_();
            else this.Off_();
        }
        Change_ = () =>
        {
            if(this.active)
                this.Off_();
            else
                this.On_();
        }
        On_ = () =>
        {
            this.active = true;
    
            if(this.type == "button")
                $(this.element).attr('disabled', '');
            else if(this.type == "block")
                $(this.element).removeClass('d-none');
    
            $(this.element).html('');
            $(this.element).append(this.text_to_change);
        }
        Off_ = () =>
        {
            this.active = false;
    
            if(this.type == "button")
                $(this.element).removeAttr('disabled');
            else if(this.type == "block")
                $(this.element).addClass('d-none');
    
            $(this.element).html(this.text_original);
        }
    }
    ,FormChecker: class
    {
        constructor(form)
        {
            this.form = form;
            this.validity = true;
        }
        Check_ = () =>
        {
            if (!$(this.form).checkValidity())
            {
                this.validity = false;
            }
        
            $(this.form).addClass('was-validated')
        
            return this.validity;
        }
    }
    ,MenuManager: class
    {
        constructor(menu, main_menu = false)
        {
            this.menu = menu;
            this.main_menu = main_menu;
            this.menus = [];
            this.current_menu = $("");
            this.current_section = $("");
            this.current_href = "";
            this.section = $("");
    
            this.AddEvent_();
            this.AddMenus_();
        }
        AddMenus_()
        {
            for(let menu of $(this.menu + " a"))
            {
                let menu_target = $(menu).attr('menu');
                this.menus.push(menu_target);
            }
    
            if(window.location.hash != "")
            {
                let menu = window.location.hash.replace('#', '');
                if(this.menus.includes(menu))
                    this.ManageMenus_(menu);
                else if(this.menus.length > 0)
                    this.ManageMenus_(this.menus[0])
            }
            else if(this.menus.length > 0)
                this.ManageMenus_(this.menus[0])
        }
        ManageMenus_(menu_target)
        {
            if(menu_target == undefined)
                return;
    
            for(let element_menu of this.menus)
            {
                if(element_menu == menu_target)
                {
                    this.current_menu = $(this.menu + " .menu_" + element_menu);
                    this.current_section = $(".section_" + element_menu);
                    let current_href = $(this.menu + " .menu_" + element_menu).attr('href');
    
                    $(this.current_menu).addClass('active');
                    $(this.current_section).removeClass('d-none');
                    if(this.main_menu)
                        window.location.hash = current_href;
                }
                else
                {
                    $(this.menu + " .menu_" + element_menu).removeClass('active');
                    $(".section_" + element_menu).addClass('d-none');
                }
            }
        }
        AddEvent_()
        {
            let current_object = this;
            $(this.menu + " a").on("click", function(e)
            {
                e.preventDefault();
                let menu_target = $(e.currentTarget).attr('menu');
                current_object.ManageMenus_(menu_target);
            });
        }
    }
    ,NotificationType: class
    {
        constructor()
        {
            this.SUCCESS = "SUCCESS";
            this.WARNING = "WARNING";
            this.ERROR = "ERROR";
        }
    }
    ,Notification: class
    {
        constructor(notification_type, time = 5000, element = '#notifications')
        {
            this.notification_type = notification_type;
            this.time = time;
            this.element = element;
            this.notification = '';
        }
        Show_ = (message) =>
        {
            let type = new NotificationType;
            switch(this.notification_type)
            {
                case type.SUCCESS:
                    this.notification = $(`
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            ${message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `);
                    break;
                case type.WARNING:
                    this.notification = $(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            ${message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `);
                    break;
                case type.ERROR:
                    this.notification = $(`
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            ${message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `);
                    break;
            }
            $(this.element).append(this.notification);
            this.Timeout_();
        }
        Timeout_()
        {
            if(this.time > 0)
                setTimeout(this.Close_, this.time, this.notification);
        }
        Close_(notification)
        {
            if(notification)
                $(notification).remove();
        }
    }
    ,ResponseData: class
    {
        constructor(error, status, body)
        {
            this.error = error;
            this.status = status;
            this.body = body;
        }
    }
    ,Request: class
    {
        constructor(endpoint = '', method = 'GET', data = {}, stringify = true)
        {
            this.endpoint = endpoint;
            this.method = method;
            this.data = data;
            this.stringify = stringify;
        }
    
        async MakeHTTPRequest()
        {
            let result;
            switch(this.method)
            {
                case "GET":
                    result = this.GETRequest_();
                    break;
                case "POST":
                    result = this.POSTRequest_();
                    break;
                case "PUT":
                    result = this.PUTRequest_();
                    break;
                case "DEL":
                    result = this.DELRequest_();
                    break;
                default:
                    result = this.GETRequest_();
                    break;
            }
            return result;
        }
    
        Exec_(callback)
        {
            let response_data = new ResponseData(false, "", []);
            this.MakeHTTPRequest()
            .then((response) =>
            {
                response_data.status = response.status;
                return response.json();
            })
            .then((body) => 
            {
                response_data.body = body;
                callback(response_data);
            })
            .catch(error =>
            {
                response_data.error = true;
                response_data.body = error;
                callback(response_data);
            });
        }
    
        async GETRequest_()
        {
            const response = await fetch(`${this.endpoint}?json=${JSON.stringify(this.data)}`
            ,{
                method: 'GET'
                ,mode: 'cors'
                ,cache: 'no-cache'
                ,credentials: 'same-origin'
                ,redirect: 'follow'
                ,referrerPolicy: 'no-referrer'
            });
            return response;
        }
    
        async POSTRequest_()
        {
            const response = await fetch(`${this.endpoint}`
            ,{
                method: 'POST'
                ,mode: 'cors'
                ,cache: 'no-cache'
                ,credentials: 'same-origin'
                ,redirect: 'follow'
                ,referrerPolicy: 'no-referrer'
                ,headers: (this.stringify ? {'Content-Type': 'application/json'} : {})
                ,body: (this.stringify ? JSON.stringify(this.data) : this.data)
            });
            return response;
        }
    
        async PUTRequest_()
        {
            const response = await fetch(`${this.endpoint}`
            ,{
                method: 'PUT'
                ,mode: 'cors'
                ,cache: 'no-cache'
                ,credentials: 'same-origin'
                ,redirect: 'follow'
                ,referrerPolicy: 'no-referrer'
                ,headers: (this.stringify ? {'Content-Type': 'application/json'} : {})
                ,body: (this.stringify ? JSON.stringify(this.data) : this.data)
            });
            return response;
        }
    
        async DELRequest_()
        {
            const response = await fetch(`${this.endpoint}`
            ,{
                method: 'DEL'
                ,mode: 'cors'
                ,cache: 'no-cache'
                ,credentials: 'same-origin'
                ,redirect: 'follow'
                ,referrerPolicy: 'no-referrer'
                ,headers: (this.stringify ? {'Content-Type': 'application/json'} : {})
                ,body: (this.stringify ? JSON.stringify(this.data) : this.data)
            });
            return response;
        }
    }
    ,RowTable: class
    {
        constructor(data)
        {
            this.data = data;
            this.customs = []
        }
        Build_ = (table, custom_rows_lambda) =>
        {
            for(let row of this.data)
            {
                let tr = $('<tr></tr>');
    
                let fields = custom_rows_lambda(row);
    
                for(let field of fields)
                    $(tr).append($(field));
    
                $(table).append(tr);
            }
        }
    }
    ,SearchElements: class
    {
        constructor(elements, search_in_element)
        {
            this.elements = elements;
            this.search_in_element = search_in_element;
            this.text_elements = new Array();
            this.searched_elements = new Array();
        }
        StringOperations_ = (words) =>
        {
            if(words.length == 0)
                return new Array();
    
            words = words.toLowerCase();
    
            words = words.replaceAll(",", "");
            words = words.split(" ");
            return words;
        }
        Filter_ = (words) =>
        {
            words = this.StringOperations_(words);
    
            for(let i = 0; i < $(this.elements).length; i++)
            {
                let c = $($(this.elements)[i]).find(this.search_in_element);
                if(c.length == 0)
                    continue;
                
                let text_to_search = $(c).text().toLowerCase();
                let included = false;
    
                for(let j = 0; j < words.length; j++)
                {
                    if(included)
                        continue;
    
                    let result = text_to_search.includes(words[j]);
                    if(result)
                    {
                        this.searched_elements.push($(this.elements)[i]);
                        included = true;
                    }
                }
            }
        }
    }
    ,SeverConfigPair: class
    {
        constructor(name, value)
        {
            this.name = name;
            this.value = value;
        }
    }
    ,ServerConfig: class
    {
        constructor
        (
            url_production = new this.SeverConfigPair("localhost", "http://localhost")
            ,url_development = new this.SeverConfigPair("localhost", "http://localhost")
            ,api_url = "/api")
        {
            this.url_production = url_production.value;
            this.url_development = url_development.value;
            this.api_url = `${this.url_production.value}${api_url}`;
            this.current_host_url = this.url_production.value;
            
            switch (window.location.hostname)
            {
                case this.url_production.name:
                    this.api_url = `${this.url_production.value}${this.api_url}`;
                    this.current_host_url = this.url_production.value;
                break;
                case this.url_development.name:
                    this.api_url = `${this.url_development.value}${this.api_url}`;
                    this.current_host_url = this.url_development.value;
                break;
                case "127.0.0.1":
                    this.api_url = `${this.url_development.value}${this.api_url}`;
                    this.current_host_url = this.url_development.value;
                break;
            }
        }
    }
    ,PassToForm: class
    {
        constructor(form, identifier, value, html = false)
        {
            let element = $(form).find(identifier);
        
            if(element != undefined)
            {
                if(html)
                    element[0].innerText = value;
                else
                    element[0].value = value;
            }
        }
    }
    ,UIElement: class
    {
        constructor(type, editable, name, value, text_name, extra_value = '')
        {
            this.type = type;
            this.editable = editable;
            this.name = name;
            this.value = value;
            this.text_name = text_name;
            this.extra_value = extra_value;
    
            this.types = 
            [
                'text'
                ,'input-text'
                ,'input-date'
                ,'option'
                ,'image'
                ,'input-image'
            ];
    
            this.VerifyType();
        }
    
        VerifyType()
        {
            if(!this.types.find(element => element == this.type))
                this.type = 'text';
        }
    }
    ,UIElementsCreator: class
    {
        constructor(elements)
        {
            this.elements = elements;
            this.final_elements = new Array();
        }
    
        ProcessType(element)
        {
            switch(element.type)
            {
                case 'text':
                    return this.CreateText(element);
                    break;
                case 'input-text':
                    return this.CreateInputText(element);
                    break;
                case 'option':
                    return this.CreateOption(element);
                    break;
                case 'image':
                    return this.CreateImage(element);
                    break;
                case 'input-image':
                    return this.CreateInputImage(element);
                    break;
            }
        }
    
        CreateElements()
        {
            for(let element of this.elements)
            {
                this.final_elements.push
                ({
                    element: this.ProcessType(element)
                    ,properties: element
                });
            }
        }
    
        CreateText(element)
        {
            return `<span>${element.value}</span>`;
        }
        CreateInputText(element)
        {
            return `<input class="form-control" type="text" name="${element.name}" value="${element.value}" placeholder="${element.text_name}">`;
        }
        CreateOption(element)
        {
            return `<option value="${element.value[0]}">${element.value[1]}</option>`;
        }
        CreateImage(element)
        {
            if(element.value != undefined && element.value != '')
                return `<img src="/uploaded-files/${element.value}" alt="${element.name}" width="100px">`;
            else
                return `<img src="${element.extra_value}" alt="" width="100px">`;
        }
        CreateInputImage(element)
        {
            if(element.value != undefined && element.value != '')
            {
                return `
                    <input class="form-control" type="file" name="${element.name}" placeholder="${element.text_name}">
                    <img class="mt-2" src="/uploaded-files/${element.value}" alt="${element.value}" width="100px">
                `;
            }
            else
            {
                return `
                    <input class="form-control" type="file" name="${element.name}" placeholder="${element.text_name}">
                    <img class="mt-2" src="${element.extra_value}" alt="" width="100px">
                `;
            }
        }
    }
    ,UILayerData: class
    {
        constructor(data, template_elements, identifier = 0)
        {
            this.data = data;
            this.template_elements = template_elements;
            this.identifier = identifier;
    
            this.final_elements = new Array();
        }
    
        CreateStructure()
        {
            for(let results_row of this.data.results)
            {
                let fields = new Array();
    
                for(let subkey in results_row)
                {
                    fields.push(new UIElement
                    (
                        this.template_elements[subkey].type
                        ,this.template_elements[subkey].editable
                        ,this.template_elements[subkey].name
                        ,results_row[subkey]
                        ,this.template_elements[subkey].text_name
                        ,this.template_elements[subkey].extra_value
                    ));
                }
    
                let result = new UIElementsCreator(fields);
                result.CreateElements();
                this.final_elements.push(result.final_elements);
            }
        }
        CreateUnitedStructure()
        {
            for(let results_row of this.data.results)
            {
                let fields = new Array();
                let values = new Array();
    
                for(let subkey in results_row)
                {
                    values.push(results_row[subkey]);
                }
    
                fields.push(new UIElement
                (
                    this.template_elements[0].type
                    ,this.template_elements[0].editable
                    ,this.template_elements[0].name
                    ,values
                    ,this.template_elements[0].text_name
                    ,this.template_elements[0].extra_value
                ));
    
                let result = new UIElementsCreator(fields);
                result.CreateElements();
                this.final_elements.push(result.final_elements);
            }
        }
    }
    ,WaitAnimation: class
    {
        constructor()
        {
            this.for_block = 
            `
                <div class="spinner_wait d-flex justify-content-center p-2">
                    <div class="spinner_wait_content spinner-border" role="status">
                        <span class="visually-hidden">...</span>
                    </div>
                </div>
            `;
            
            this.for_select = 
            `
                <option class="d-flex justify-content-center p-2 disabled">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">...</span>
                    </div>
                </option>
            `;
            
            this.for_button = 
            `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            `;
            
            this.for_page = 
            $(`
                <div class="d-flex justify-content-center align-items-center position-fixed top-0 w-100 h-100 bg-white" style="z-index: 1000;">
                    <div class="spinner-border" role="status">
                    </div>
                    <p class="ms-4">Espere...</p>
                </div>
            `);
        }
    }
};