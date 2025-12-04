
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
    ,ElementState: class
    {
        constructor(element, change = false, type = "button", content_to_change = "")
        {
            this.element = element;
            this.change = change;
            this.type = type;
            this.content_to_change = content_to_change;
            this.original_content = $(element).html();
            this.active = false;
    
            this.On_();
        }
        On_ = () =>
        {
            this.active = true;
    
            if(this.type == "button" && this.change == true)
                $(this.element).attr('disabled', '');
            else if(this.type == "block" && this.change == true)
                $(this.element).removeClass('d-none');
    
            $(this.element).html('');
            $(this.element).append(this.content_to_change);
        }
        Off_ = () =>
        {
            this.active = false;
    
            if(this.type == "button" && this.change == true)
                $(this.element).removeAttr('disabled');
            else if(this.type == "block" && this.change == true)
                $(this.element).addClass('d-none');
    
            $(this.element).html(this.original_content);
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
            if (!$(this.form)[0].checkValidity())
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
                if(menu_target != undefined)
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
        constructor(notification_type, time = 5000, element = '#notifications', clean = false)
        {
            this.notification_type = notification_type;
            this.time = time;
            this.element = element;
            this.clean = clean;
            this.notification = '';
        }
        Show_ = (message) =>
        {
            if(this.clean)
                $(this.element).html('');
            
            let type = new wtools.NotificationType;
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
        constructor(endpoint = '', method = 'GET', data = undefined, stringify = false)
        {
            this.endpoint = endpoint;
            this.method = method;
            this.data = data;
            this.stringify = stringify;
            this.mode = 'cors';
            this.cache = 'no-cache';
            this.credentials = 'same-origin';
            this.redirect = 'follow';
            this.referrerPolicy = 'no-referrer';
            if (stringify)
                this.headers = {'Content-Type': 'application/json'};
            else
                this.headers = {};
            this.body = "";
        }
    
        async MakeHTTPRequest()
        {
            let result;
            switch(this.method)
            {
                case "GET":
                    result = await this.GETRequest_();
                    break;
                case "POST":
                    result = await this.POSTRequest_();
                    break;
                case "PUT":
                    result = await this.PUTRequest_();
                    break;
                case "DEL":
                    result = await this.DELRequest_();
                    break;
                case "DELETE":
                    result = await this.DELETERequest_();
                    break;
                default:
                    result = await this.GETRequest_();
                    break;
            }
            return result;
        }
    
        async Exec_(callback)
        {
            let response_data = new wtools.ResponseData(false, "", []);
            await this.MakeHTTPRequest()
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

        async ExecPlain_(callback)
        {
            let response_data = new wtools.ResponseData(false, "", []);
            await this.MakeHTTPRequest()
            .then((response) =>
            {
                response_data.status = response.status;
                response_data.body = response.body;
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
            const json_string = this.stringify ? "?json=" + JSON.stringify(this.data) : "";
            const response = await fetch(this.endpoint + json_string
            ,{
                method: 'GET'
                ,mode: this.mode
                ,cache: this.cache
                ,credentials: this.credentials
                ,redirect: this.redirect
                ,referrerPolicy: this.referrerPolicy
            });
            return response;
        }
    
        async POSTRequest_()
        {
            const response = await fetch(`${this.endpoint}`
            ,{
                method: 'POST'
                ,mode: this.mode
                ,cache: this.cache
                ,credentials: this.credentials
                ,redirect: this.redirect
                ,referrerPolicy: this.referrerPolicy
                ,headers: this.headers
                ,body: (this.stringify ? JSON.stringify(this.data) : this.data)
            });
            return response;
        }
    
        async PUTRequest_()
        {
            const response = await fetch(`${this.endpoint}`
            ,{
                method: 'PUT'
                ,mode: this.mode
                ,cache: this.cache
                ,credentials: this.credentials
                ,redirect: this.redirect
                ,referrerPolicy: this.referrerPolicy
                ,headers: this.headers
                ,body: (this.stringify ? JSON.stringify(this.data) : this.data)
            });
            return response;
        }
    
        async DELRequest_()
        {
            const response = await fetch(`${this.endpoint}`
            ,{
                method: 'DEL'
                ,mode: this.mode
                ,cache: this.cache
                ,credentials: this.credentials
                ,redirect: this.redirect
                ,referrerPolicy: this.referrerPolicy
            });
            return response;
        }

        async DELETERequest_()
        {
            const response = await fetch(`${this.endpoint}`
            ,{
                method: 'DELETE'
                ,mode: this.mode
                ,cache: this.cache
                ,credentials: this.credentials
                ,redirect: this.redirect
                ,referrerPolicy: this.referrerPolicy
            });
            return response;
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
            url_production = new wtools.SeverConfigPair("localhost", "http://localhost")
            ,url_development = new wtools.SeverConfigPair("localhost", "http://localhost")
            ,api_url = "/api"
        )
        {
            this.url_production = url_production.value;
            this.url_development = url_development.value;
            this.api_url = api_url;
            this.current = 
            {
                host: `${this.url_production}`
                ,api: `${this.url_production}${this.api_url}`
            }
            
            switch (window.location.hostname)
            {
                case this.url_production.name:
                    this.current.host = `${this.url_production}`;
                    this.current.api = `${this.url_production}${this.api_url}`;
                break;
                case this.url_development.name:
                    this.current.host = `${this.url_development}`;
                    this.current.api = `${this.url_development}${this.api_url}`;
                break;
                default:
                    this.current.host = `${this.url_development}`;
                    this.current.api = `${this.url_development}${this.api_url}`;
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
    ,UIElementsPackage: class
    {
        constructor(package_e, elements)
        {
            this.package_e = package_e;
            this.elements = elements;
        }
        Pack_()
        {
            let final_element = $(this.package_e)
            for(let element of this.elements)
                $(final_element).append(element);

            return final_element;
        }
    }
    ,UIElementsCreator: class
    {
        constructor(target, data) // Object
        {
            this.target = target;
            this.data = data;
        }
        Build_ = (callback_creator = function(row = {id: 1}){ return [row.id]}) =>
        {
            for(let row of this.data)
            {
                const results = callback_creator(row);
                if (results == undefined)
                    continue;
                else
                    $(this.target).append(results);
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
                <div class="d-flex justify-content-center align-items-center position-fixed top-0 w-100 h-100 bg-white" style="z-index: 100000;">
                    <div class="spinner-border" role="status">
                    </div>
                    <p class="ms-4">Espere...</p>
                </div>
            `);
        }
    }
    ,FullScreenMessage: class
    {
        constructor(message = "")
        {
            this.message = 
            $(`
                <div class="d-flex justify-content-center align-items-center position-fixed top-0 w-100 h-100 bg-white" style="z-index: 100000;">
                    <h4 class="ms-4 fw-bold">${message}</h4>
                </div>
            `);
        }
        Get_()
        {
            return this.message;
        }
    }
    ,OptionValue: class
    {
        constructor(value, option, selected = false)
        {
            this.value = value;
            this.option = option;
            this.selected = selected;
        }
    }
    ,SelectOptions: class
    {
        constructor(options = new Array)
        {
            this.options = options;
        }
        Build_(target)
        {
            $(target).html('');
            for(const option of this.options)
            {
                if(option.selected)
                    $(target).append($(`<option value="${option.value}" selected>${option.option}</option>`));
                else
                    $(target).append($(`<option value="${option.value}">${option.option}</option>`));
            }
        }
        ValueToOption_(value)
        {
            for(const option of this.options)
            {
                if(option.value == value)
                    return option.option;
            }
        }
        OptionToValue_(option_name)
        {
            for(const option of this.options)
            {
                if(option.option == option_name)
                    return option.value;
            }
        }
    }
    ,IFUndefined: function(val1, val2)
    {
        if(val1 == undefined)
            return val2;
        else
            return val1;
    }
    ,CleanForm: function(form)
    {
        $(form).removeClass('was-validated');
        $(':input', $(form))
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .prop('checked', false)
            .prop('selected', false);
    }
    ,GetUrlSearchParam: function(param)
    {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
};