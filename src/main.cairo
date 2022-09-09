%lang starknet
from starkware.cairo.common.math import assert_nn
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import get_caller_address

@storage_var
func names(address: felt) -> (name: felt):
end

@external
func storeName{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    _name: felt
):
    let (caller) = get_caller_address()
    names.write(caller, _name)
    return ()
end

@view
func getName{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    _address: felt
) -> (name: felt):
    let (name) = names.read(_address)
    return (name)
end