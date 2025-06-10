function LoadingOnTable() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

      <div className="flex justify-center w-full mt-10 ">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
      </div>
    </div>
  );
}

export default LoadingOnTable;
