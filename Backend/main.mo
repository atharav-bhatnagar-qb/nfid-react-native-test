import Principal "mo:base/Principal";
actor{
    public shared({caller=user}) func whoami():async Text{
        return Principal.toText(user);
    }
}