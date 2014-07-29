<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
    public class TrustAllCertificatePolicy : System.Net.ICertificatePolicy
    {
        public TrustAllCertificatePolicy() {}
        public bool CheckValidationResult(ServicePoint sp, System.Security.Cryptography.X509Certificates.X509Certificate cert, WebRequest req, int problem)
        {
            return true;            
        }
    }

    protected override void OnPreInit(EventArgs e)
    {
        base.OnPreInit(e);
        this.Theme = null;
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        string Uri = Request["uri"];
        string Action = Request["action"];
        if (string.IsNullOrEmpty(Uri))
            return;

        HttpWebRequest request = null;
        HttpWebResponse response = null;
        StringBuilder sb = new StringBuilder();
        AddToSb(sb, Request.QueryString);
        AddToSb(sb, Request.Form);
        string query = sb.ToString();
        
        if (query.Length > 0)
        {
            if (Uri.IndexOf("?") == -1)
                Uri = string.Format("{0}?{1}", Uri, query.Substring(1));
            else
                Uri = string.Format("{0}{1}", Uri, query);
        }

        request = (HttpWebRequest)HttpWebRequest.Create(Uri);
        request.Method = Request.HttpMethod;
        request.KeepAlive = true;
        request.Headers.Add("Cookie", Request.Headers["Cookie"]);
        CloneToNV(Request.Headers, request.Headers);

        if (Request.HttpMethod.Equals("POST", StringComparison.OrdinalIgnoreCase))
        {
            request.ContentLength = 0;
        }

        System.Net.ServicePointManager.CertificatePolicy = new TrustAllCertificatePolicy();
        response = (HttpWebResponse)request.GetResponse();
        Stream rs = response.GetResponseStream();
        if (Uri.IndexOf(".pdf") != -1) 
        {
            Response.ContentType = "application/pdf"; 
            if (Action == "download") 
            {
                string[] url = Uri.Split('/');
                string[] arr = url[url.Length - 1].Split('?');
                Response.AddHeader("Content-Disposition", "attachment;filename=" + arr[0]);
            }
            
            int buffer = 1024;
            while (true)
            {
                byte[] bytes = new byte[buffer];
                int size = rs.Read(bytes, 0, buffer);
                if (size == 0) break;
                if (size == buffer) Response.BinaryWrite(bytes);
                else 
                {
                    byte[] last = new byte[size];
                    for (int i = 0; i < size; i++) last[i] = bytes[i];
                    Response.BinaryWrite(last);
                }
            }
        } 
        else 
        {
            StreamReader sr = new StreamReader(rs);
            Response.Write(sr.ReadToEnd());
        }
    }

    private void CloneToNV(NameValueCollection ori, NameValueCollection tar)
    {
        foreach (var key in ori.AllKeys)
        {
            if (!new string[] { "Authorization" }.Contains(key))
                continue;
            if (tar[key] == null)
                tar.Add(key, ori[key]);
            else
                tar[key] = ori[key];
        }
    }

    private void AddToSb(StringBuilder sb, NameValueCollection ori)
    {
        foreach (var key in ori.AllKeys)
        {
            if (key.Equals("uri", StringComparison.OrdinalIgnoreCase))
                continue;
            sb.Append(string.Format("&{0}={1}", key, ori[key]));
        }
    }
</script>