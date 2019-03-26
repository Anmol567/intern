#include<iostream>
using namespace std;
bool check(long long int ans,long long int *arr,long long int n,long long int c)
{
	int cow=1;
	int pos=0;
	for(int m=1;m<n;m++)
	{
	if(arr[m]-pos>=ans)
	{
	pos=arr[m];
	cow++;
	}
	if(cow==c)
	return true;
	}
	
	return false;
}
int main()
{
	int t;
	cin>>t;
	long long int n;
	long long int c;
	cin>>n>>c;
	long long int *arr=new  long long int[n];
	for(int m=0;m<n;m++)
	cin>>arr[m];
	sort(arr,arr+n);
	long long int start=arr[0];
	long long int end=arr[n-1]-arr[0];
	long long int ans=(start+end)/2;
    while(start<end)
    {
    if(check(ans,arr,n,c))
    {
    start=ans+1;

    }
    else
    end=ans-1;
    }
}