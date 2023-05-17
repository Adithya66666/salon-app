import React from "react";
import './Footer.css';

export const Footer = () => {

  return (
    <>
    

    <footer class="site-footer justify-content-center align-items-center d-flex flex-column">
    <div class="w-50">
        <div class="text-center">
            <h6 className="text-center w-100">About</h6>
            <p class="text-justify">
                Hospital Management System is the most accredited system in the Sri Lankan 
                healthcare sector. Since 2002, Lanka Hospitals has revolutionized 
                the healthcare industry through infrastructure development and
                advancement of products and services, with a view to deliver 
                healthcare that is on par with global medical standards.
            </p>
        </div>
    </div>
    <div class="mb-4">
        <div class="w-100">
            <p class="copyright-text text-center">Copyright &copy; 2017 All Rights Reserved by 
            </p>
        </div>
    </div>
</footer>


    </>
  );
};
