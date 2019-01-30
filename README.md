# DNN Module Angular.js

#### Preview.

<p align="center"><br />
  <img src="https://i.ibb.co/FKBfmYp/dnn-gif.gif" />
</p>

## Scripts

- Library [angular.min.js v1.6.9] https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js
- Routing [angular-route.min.js v1.6.6] https://ajax.googleapis.com/ajax/libs/angularjs/1.6.6/angular-route.min.js

## Edit DNN Site

File: Default.aspx

- Change - head tag html

```cs
    <script src="/Resources/Shared/Scripts/angular.min.js" type="text/javascript"></script>
    <script src="/Resources/Shared/Scripts/angular-route.min.js"></script>
```

- Change - body tag html

```cs
    <body ng-app="myApp" id="Body" runat="server">...</body>
```

- Result

```cs
<%@ Page Language="C#" AutoEventWireup="True" Inherits="DotNetNuke.Framework.DefaultPage" CodeBehind="Default.aspx.cs" %>
<%@ Register TagPrefix="dnncrm" Namespace="DotNetNuke.Web.Client.ClientResourceManagement" Assembly="DotNetNuke.Web.Client" %>
<%@ Register TagPrefix="dnn" Namespace="DotNetNuke.Common.Controls" Assembly="DotNetNuke" %>
<asp:literal id="skinDocType" runat="server" ViewStateMode="Disabled"/>
<html <asp:literal id="attributeList" runat="server" ViewStateMode="Disabled"></asp:literal>>
<head id="Head" runat="server" ViewStateMode="Disabled">
    <script src="/Resources/Shared/Scripts/angular.min.js" type="text/javascript"></script>
    <script src="/Resources/Shared/Scripts/angular-route.min.js"></script>
    <asp:PlaceHolder runat="server" ID="metaPanel"></asp:PlaceHolder>
    <title />
    <meta id="MetaRefresh" runat="Server" http-equiv="Refresh" name="Refresh" Visible="False" />
    <meta id="MetaDescription" runat="Server" name="DESCRIPTION" Visible="False"/>
    <meta id="MetaKeywords" runat="Server" name="KEYWORDS" Visible="False"/>
    <meta id="MetaCopyright" runat="Server" name="COPYRIGHT" Visible="False"/>
    <meta id="MetaGenerator" runat="Server" name="GENERATOR" Visible="False"/>
    <meta id="MetaAuthor" runat="Server" name="AUTHOR" Visible="False"/>
    <meta id="MetaRobots" runat="server" name="ROBOTS" Visible="False" />
    <asp:PlaceHolder runat="server" ID="ClientDependencyHeadCss"></asp:PlaceHolder>
    <asp:PlaceHolder runat="server" ID="ClientDependencyHeadJs"></asp:PlaceHolder>
    <asp:placeholder id="CSS" runat="server" />
    <asp:placeholder id="SCRIPTS" runat="server" />
</head>
<body ng-app="myApp" id="Body" runat="server">
    <dnn:Form ID="Form" runat="server" ENCTYPE="multipart/form-data">
        <asp:PlaceHolder ID="BodySCRIPTS" runat="server" />
        <asp:Label ID="SkinError" runat="server" CssClass="NormalRed" Visible="False"></asp:Label>
        <asp:PlaceHolder ID="SkinPlaceHolder" runat="server" />
        <input id="ScrollTop" runat="server" name="ScrollTop" type="hidden" />
        <input id="__dnnVariable" runat="server" name="__dnnVariable" type="hidden" autocomplete="off" />
        <asp:placeholder runat="server" ID="ClientResourcesFormBottom" />
    </dnn:Form>
    <asp:placeholder runat="server" id="ClientResourceIncludes" />
    <dnncrm:ClientResourceLoader runat="server" id="ClientResourceLoader">
        <Paths>
            <dnncrm:ClientResourcePath Name="SkinPath" Path="<%# CurrentSkinPath %>" />
            <dnncrm:ClientResourcePath Name="SharedScripts" Path="~/Resources/Shared/Scripts/" />
        </Paths>
    </dnncrm:ClientResourceLoader>
</body>
</html>
```
