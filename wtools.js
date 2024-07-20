
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
};