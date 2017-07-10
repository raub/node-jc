kernel void AtomicSum(global int* sum){
    local int tmpSum[4];
    if(get_local_id(0)<4){
        tmpSum[get_local_id(0)]=0;
    }
    barrier(CLK_LOCAL_MEM_FENCE);
    atomic_add(&tmpSum[get_global_id(0)%4],1);
    barrier(CLK_LOCAL_MEM_FENCE);
    if(get_local_id(0)==(get_local_size(0)-1)){
        atomic_add(sum,tmpSum[0]+tmpSum[1]+tmpSum[2]+tmpSum[3]);
    }
}
